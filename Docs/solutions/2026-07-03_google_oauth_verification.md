# Google OAuth ID Token Verification Security Controls

**Date**: 2026-07-03  
**Status**: Implemented  

This document describes how the backend verifies Google OAuth ID Tokens securely without requiring a Google Client Secret.

## Verification Requirements

When verifying a Google ID Token, we must ensure four security assertions hold true:
1. **Signature Verification (Signer)**: The token's cryptographic signature must be validated against Google's rotating public keys.
2. **Audience (`aud`)**: The token must be intended for our app, meaning the `aud` claim matches our backend `GOOGLE_CLIENT_ID`.
3. **Issuer (`iss`)**: The token must have been issued by Google (`accounts.google.com` or `https://accounts.google.com`).
4. **Expiration (`exp`)**: The token must not have expired.

## How it is Implemented in WrectifAI

In [google-auth.service.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/services/google-auth.service.ts), we verify Google ID tokens using the official `google-auth-library` provided by Google:

```typescript
const client = new OAuth2Client(googleClientId);
const ticket = await client.verifyIdToken({
  idToken: token,
  audience: googleClientId,
});
```

### Under the Hood Verification Details

The `client.verifyIdToken` utility automatically performs the following security checks on every request:

| Security Assertion | Details & Automated Behavior |
|---|---|
| **Cryptographic Signature** | Downloads Google's JSON Web Key Sets (JWKS) from `https://www.googleapis.com/oauth2/v3/certs`, caches them, and verifies the JWT signature. |
| **Audience (`aud`)** | Asserts that `payload.aud` matches the `googleClientId` passed as the `audience` parameter. If they do not match, it throws an error. |
| **Issuer (`iss`)** | Asserts that `payload.iss` is either `https://accounts.google.com` or `accounts.google.com`. |
| **Expiration (`exp`)** | Verifies the current system time is less than `payload.exp` (with a built-in clock-skew buffer of a few minutes). |

This ensures that only authentic Google authentication assertions intended for our client application are accepted.
