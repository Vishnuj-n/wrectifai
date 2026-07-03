import { Router } from 'express';
import { success, error } from '../../utils/response';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../services/jwt.service';
import { query } from '../../config/database';

export const authRouter = Router();

const HARDCODED_PHONES = ['9876543210', '1234567890'];
const HARDCODED_OTP = '123456';

authRouter.post('/register', async (req, res, next) => {
  const { mobileNumber, name, otp, role = 'user' } = req.body;
  if (!mobileNumber || !name || !otp) {
    return error(res, 'Phone number, name, and OTP are required', 'BAD_REQUEST', 400);
  }

  if (otp !== HARDCODED_OTP || !HARDCODED_PHONES.includes(mobileNumber)) {
    return error(res, 'Invalid phone number or OTP', 'UNAUTHORIZED', 401);
  }

  try {
    const existingUser = await query('SELECT * FROM users WHERE mobile_number = $1', [mobileNumber]);
    let user;
    let isNew = false;
    
    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
      await query('UPDATE users SET name = $1 WHERE id = $2', [name, user.id]);
      user.name = name;
    } else {
      const userResult = await query(
        'INSERT INTO users (mobile_number, name, status) VALUES ($1, $2, $3) RETURNING id, email, name, mobile_number, status',
        [mobileNumber, name, 'active']
      );
      user = userResult.rows[0];
      isNew = true;
    }

    if (isNew) {
      const roleResult = await query('SELECT id FROM roles WHERE code = $1', [role]);
      if (roleResult.rows.length > 0) {
        const roleId = roleResult.rows[0].id;
        await query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, roleId]);
      }
    }

    const rolesResult = await query(
      'SELECT r.code FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
      [user.id]
    );
    const roles = rolesResult.rows.map((row) => row.code);

    const accessToken = generateAccessToken({ userId: user.id, roles });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return success(res, {
      user: {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobile_number,
        status: user.status,
        roles,
      },
      accessToken,
      refreshToken,
    }, 201);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  const { mobileNumber, otp, provider } = req.body;

  try {
    let user;
    const role = 'user';
    let isNew = false;

    // Handle stubbed OAuth
    if (provider) {
      if (provider !== 'google' && provider !== 'apple') {
        return error(res, 'Invalid OAuth provider', 'BAD_REQUEST', 400);
      }

      const mockEmail = `${provider}-user@wrectifai.com`;
      const mockName = provider === 'google' ? 'Google User' : 'Apple User';

      const existingUser = await query('SELECT * FROM users WHERE email = $1', [mockEmail]);
      if (existingUser.rows.length > 0) {
        user = existingUser.rows[0];
      } else {
        const userResult = await query(
          'INSERT INTO users (email, name, status) VALUES ($1, $2, $3) RETURNING id, email, name, mobile_number, status',
          [mockEmail, mockName, 'active']
        );
        user = userResult.rows[0];
        isNew = true;
      }
    } else {
      // Handle phone OTP login
      if (!mobileNumber || !otp) {
        return error(res, 'Phone number and OTP are required', 'BAD_REQUEST', 400);
      }

      if (otp !== HARDCODED_OTP || !HARDCODED_PHONES.includes(mobileNumber)) {
        return error(res, 'Invalid phone number or OTP', 'UNAUTHORIZED', 401);
      }

      const existingUser = await query('SELECT * FROM users WHERE mobile_number = $1', [mobileNumber]);
      if (existingUser.rows.length > 0) {
        user = existingUser.rows[0];
      } else {
        const userResult = await query(
          'INSERT INTO users (mobile_number, name, status) VALUES ($1, $2, $3) RETURNING id, email, name, mobile_number, status',
          [mobileNumber, 'Demo User', 'active']
        );
        user = userResult.rows[0];
        isNew = true;
      }
    }

    if (isNew) {
      const roleResult = await query('SELECT id FROM roles WHERE code = $1', [role]);
      if (roleResult.rows.length > 0) {
        const roleId = roleResult.rows[0].id;
        await query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, roleId]);
      }
    }

    const rolesResult = await query(
      'SELECT r.code FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
      [user.id]
    );
    const roles = rolesResult.rows.map((row) => row.code);

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, roles });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobileNumber: user.mobile_number,
        status: user.status,
        roles,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return error(res, 'Refresh token is required', 'BAD_REQUEST', 400);
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ userId: decoded.userId, roles: ['user'] });
    return success(res, { accessToken });
  } catch {
    return error(res, 'Invalid refresh token', 'UNAUTHORIZED', 401);
  }
});

authRouter.post('/logout', (req, res) => {
  return success(res, { message: 'Logged out successfully' });
});

authRouter.get('/status', (_req, res) => {
  return success(res, { feature: 'auth', status: 'ready' });
});
