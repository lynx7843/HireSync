import { beforeAll, describe, expect, it } from 'vitest';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { issueToken } from '../auth.js';
import { registerAuthGuard } from '../plugins/require-auth.js';
import { candidateRoutes } from './candidates.js';
import { applicationRoutes } from './applications.js';

// Every case here is rejected by the auth guard or schema validation before a
// handler runs, so no database is needed.
const server = Fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
registerAuthGuard(server);
server.register(candidateRoutes, { prefix: '/api' });
server.register(applicationRoutes, { prefix: '/api' });

const id = '3f1c2b1e-8a4d-4c2b-9f6e-1a2b3c4d5e6f';
let auth: { authorization: string };

beforeAll(async () => {
  await server.ready();
  const { token } = issueToken({ sub: 'recruiter@example.com', email: 'recruiter@example.com', role: 'recruiter' });
  auth = { authorization: `Bearer ${token}` };
});

describe('auth guard', () => {
  it('rejects requests without a token', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/candidates' });
    expect(res.statusCode).toBe(401);
  });

  it('rejects requests with an invalid token', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/candidates', headers: { authorization: 'Bearer nope' } });
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/candidates validation', () => {
  it.each([
    ['javascript: linkedin_url', { name: 'A', email: 'a@example.com', linkedin_url: 'javascript:alert(1)' }],
    ['http:// linkedin_url', { name: 'A', email: 'a@example.com', linkedin_url: 'http://linkedin.com/in/a' }],
    ['empty name', { name: '', email: 'a@example.com' }],
    ['invalid email', { name: 'A', email: 'not-an-email' }],
  ])('rejects %s', async (_label, payload) => {
    const res = await server.inject({ method: 'POST', url: '/api/candidates', headers: auth, payload });
    expect(res.statusCode).toBe(400);
  });
});

describe('query and param validation', () => {
  it.each([
    ['GET', '/api/candidates?status=bogus'],
    ['GET', '/api/applications?status=bogus'],
    ['GET', '/api/candidates/not-a-uuid'],
    ['GET', '/api/applications/not-a-uuid'],
  ] as const)('%s %s -> 400', async (method, url) => {
    const res = await server.inject({ method, url, headers: auth });
    expect(res.statusCode).toBe(400);
  });
});

describe('PATCH /api/applications/:id validation', () => {
  it.each([
    ['unknown status', { status: 'bogus' }],
    ['invalid applied_at', { applied_at: 'not-a-date' }],
    ['empty job_title', { job_title: '' }],
    ['non-integer salary', { salary_expectation: 1.5 }],
  ])('rejects %s', async (_label, payload) => {
    const res = await server.inject({ method: 'PATCH', url: `/api/applications/${id}`, headers: auth, payload });
    expect(res.statusCode).toBe(400);
  });
});
