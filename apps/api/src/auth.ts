import crypto from 'node:crypto';

/**
 * Minimal HS256 JWT + credential handling, built on node:crypto so the API
 * gains authentication without pulling in new runtime dependencies.
 *
 * Required env:
 *   JWT_SECRET          - signing secret (>= 32 chars). The server refuses to
 *                         start without it, so the API can never boot open.
 *   AUTH_EMAIL          - the operator account allowed to sign in.
 *   AUTH_PASSWORD_HASH  - scrypt hash of that account's password, formatted as
 *                         `scrypt:<salt-hex>:<key-hex>`. For local development
 *                         AUTH_PASSWORD (plaintext) is accepted instead.
 * Optional env:
 *   AUTH_TOKEN_TTL      - token lifetime in seconds (default 28800 = 8h).
 */

export interface AuthUser {
  sub: string;
  email: string;
  role: 'recruiter';
}

export interface TokenPayload extends AuthUser {
  iat: number;
  exp: number;
}

const DEFAULT_TTL_SECONDS = 60 * 60 * 8;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. The API refuses to start without authentication configured.`
    );
  }
  return value;
}

const secret = requireEnv('JWT_SECRET');
if (secret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long.');
}

const authEmail = requireEnv('AUTH_EMAIL').toLowerCase();
const passwordHash = process.env.AUTH_PASSWORD_HASH;
const plaintextPassword = process.env.AUTH_PASSWORD;

if (!passwordHash && !plaintextPassword) {
  throw new Error('Set AUTH_PASSWORD_HASH (or AUTH_PASSWORD for local development).');
}

export const usingPlaintextPassword = !passwordHash;

const ttlSeconds = Number(process.env.AUTH_TOKEN_TTL ?? DEFAULT_TTL_SECONDS);
if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
  throw new Error('AUTH_TOKEN_TTL must be a positive number of seconds.');
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(data: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

/** Constant-time comparison that tolerates differing lengths. */
function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so the timing does not leak the length.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function issueToken(user: AuthUser): { token: string; expiresAt: Date } {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttlSeconds;
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ ...user, iat, exp } satisfies TokenPayload));
  const signature = sign(`${header}.${payload}`);
  return { token: `${header}.${payload}.${signature}`, expiresAt: new Date(exp * 1000) };
}

/** Returns the payload for a valid, unexpired token, or null otherwise. */
export function verifyToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  if (!safeEquals(signature, sign(`${header}.${payload}`))) return null;

  let decoded: TokenPayload;
  try {
    const headerJson = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
    if (headerJson?.alg !== 'HS256') return null;
    decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (typeof decoded?.exp !== 'number' || decoded.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }
  if (typeof decoded.sub !== 'string' || typeof decoded.email !== 'string') return null;

  return decoded;
}

/** Verifies credentials against the configured operator account. */
export function verifyCredentials(email: string, password: string): AuthUser | null {
  const emailMatches = safeEquals(email.trim().toLowerCase(), authEmail);

  let passwordMatches = false;
  if (passwordHash) {
    passwordMatches = verifyScryptHash(password, passwordHash);
  } else {
    passwordMatches = safeEquals(password, plaintextPassword!);
  }

  if (!emailMatches || !passwordMatches) return null;
  return { sub: authEmail, email: authEmail, role: 'recruiter' };
}

function verifyScryptHash(password: string, stored: string): boolean {
  const [scheme, saltHex, keyHex] = stored.split(':');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, 'hex');
  let derived: Buffer;
  try {
    derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  } catch {
    return false;
  }
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}
