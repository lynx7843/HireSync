import { afterEach, describe, expect, it, vi } from 'vitest';
import { issueToken, verifyCredentials, verifyToken } from './auth.js';

const user = { sub: 'recruiter@example.com', email: 'recruiter@example.com', role: 'recruiter' as const };

afterEach(() => {
  vi.useRealTimers();
});

describe('issueToken / verifyToken', () => {
  it('round-trips a freshly issued token', () => {
    const { token } = issueToken(user);
    expect(verifyToken(token)).toMatchObject(user);
  });

  it('rejects a token with a tampered payload', () => {
    const { token } = issueToken(user);
    const [header, , signature] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ ...user, email: 'attacker@example.com', exp: 9999999999 })).toString('base64url');
    expect(verifyToken(`${header}.${forged}.${signature}`)).toBeNull();
  });

  it('rejects malformed tokens', () => {
    expect(verifyToken('')).toBeNull();
    expect(verifyToken('a.b')).toBeNull();
    expect(verifyToken('not.a.token')).toBeNull();
  });

  it('rejects an expired token', () => {
    vi.useFakeTimers();
    const { token, expiresAt } = issueToken(user);
    vi.setSystemTime(expiresAt.getTime() + 1000);
    expect(verifyToken(token)).toBeNull();
  });
});

describe('verifyCredentials', () => {
  it('accepts the configured account, ignoring email case and whitespace', () => {
    expect(verifyCredentials('  Recruiter@Example.com ', 'correct-horse-battery-staple')).toEqual(user);
  });

  it('rejects a wrong password or unknown email', () => {
    expect(verifyCredentials('recruiter@example.com', 'wrong')).toBeNull();
    expect(verifyCredentials('someone@example.com', 'correct-horse-battery-staple')).toBeNull();
  });
});
