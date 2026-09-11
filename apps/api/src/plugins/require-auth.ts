import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken, type TokenPayload } from '../auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

// Endpoints under /api that must stay reachable without a token.
const PUBLIC_PATHS = new Set(['/api/auth/login']);

/**
 * Guards every /api/* route. Anything not explicitly public requires a valid
 * `Authorization: Bearer <token>` header, so candidate PII, salary data and
 * internal notes are never served to an unauthenticated caller.
 */
export function registerAuthGuard(server: FastifyInstance) {
  server.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const path = request.url.split('?')[0].replace(/\/+$/, '') || '/';

    if (!path.startsWith('/api')) return;
    if (request.method === 'OPTIONS') return; // CORS preflight carries no header
    if (PUBLIC_PATHS.has(path)) return;

    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const payload = verifyToken(header.slice('Bearer '.length).trim());
    if (!payload) {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }

    request.user = payload;
  });
}
