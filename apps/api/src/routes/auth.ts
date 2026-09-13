import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { issueToken, verifyCredentials } from '../auth.js';

// Simple in-memory throttle so the single operator account cannot be
// brute-forced from a reachable port.
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; firstAttemptAt: number }>();

function isLockedOut(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAttemptAt > LOCKOUT_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAttemptAt > LOCKOUT_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: Date.now() });
    return;
  }
  entry.count += 1;
}

export async function authRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.post('/auth/login', {
    schema: {
      body: z.object({
        email: z.email(),
        password: z.string().min(1),
      })
    }
  }, async (request, reply) => {
    const { email, password } = request.body;
    const throttleKey = request.ip;

    if (isLockedOut(throttleKey)) {
      return reply.status(429).send({ error: 'Too many failed login attempts. Try again later.' });
    }

    const user = verifyCredentials(email, password);
    if (!user) {
      recordFailure(throttleKey);
      // Deliberately vague: do not reveal whether the email exists.
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    attempts.delete(throttleKey);
    const { token, expiresAt } = issueToken(user);
    return reply.send({
      token,
      expires_at: expiresAt.toISOString(),
      user: { email: user.email, role: user.role }
    });
  });

  // Lets a client confirm its token is still valid (guarded by the /api hook).
  app.get('/auth/me', async (request, reply) => {
    return reply.send({ user: request.user });
  });
}
