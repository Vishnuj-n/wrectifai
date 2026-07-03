import { Router } from 'express';
import { success, error } from '../../utils/response';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../services/jwt.service';
import { query } from '../../config/database';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  const { email, password, name, mobileNumber, role = 'user' } = req.body;
  if (!email || !password || !name) {
    return error(res, 'Email, password, and name are required', 'BAD_REQUEST', 400);
  }

  try {
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return error(res, 'User with this email already exists', 'CONFLICT', 409);
    }

    const passwordHash = `mock_hash_${password}`;
    const userResult = await query(
      'INSERT INTO users (email, password_hash, name, mobile_number, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, mobile_number, status',
      [email, passwordHash, name, mobileNumber || null, 'active']
    );
    const user = userResult.rows[0];

    const roleResult = await query('SELECT id FROM roles WHERE code = $1', [role]);
    if (roleResult.rows.length > 0) {
      const roleId = roleResult.rows[0].id;
      await query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, roleId]);
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, roles: [role] });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobileNumber: user.mobile_number,
        status: user.status,
        roles: [role],
      },
      accessToken,
      refreshToken,
    }, 201);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return error(res, 'Email and password are required', 'BAD_REQUEST', 400);
  }

  try {
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return error(res, 'Invalid email or password', 'UNAUTHORIZED', 401);
    }
    const user = userResult.rows[0];

    const passwordHash = `mock_hash_${password}`;
    if (user.password_hash !== passwordHash) {
      return error(res, 'Invalid email or password', 'UNAUTHORIZED', 401);
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
  } catch (err) {
    return error(res, 'Invalid refresh token', 'UNAUTHORIZED', 401);
  }
});

authRouter.post('/logout', (req, res) => {
  return success(res, { message: 'Logged out successfully' });
});

authRouter.get('/status', (_req, res) => {
  return success(res, { feature: 'auth', status: 'ready' });
});
