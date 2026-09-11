import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { 
  serializerCompiler, 
  validatorCompiler, 
  ZodTypeProvider,
  hasZodFastifySchemaValidationErrors
} from 'fastify-type-provider-zod';
import { prisma } from './db.js';
import { usingPlaintextPassword } from './auth.js';
import { registerAuthGuard } from './plugins/require-auth.js';
import { authRoutes } from './routes/auth.js';
import { applicationRoutes } from './routes/applications.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { candidateRoutes } from './routes/candidates.js';

// Create the Fastify instance and enable the Zod type provider
const server = Fastify({
  logger: true, // Enables built-in request logging
}).withTypeProvider<ZodTypeProvider>();

// Only the frontend origins we know about may call this API from a browser.
// Reflecting any origin would let any site a signed-in recruiter visits read
// candidate PII with their token. Override with a comma-separated CORS_ORIGINS.
const DEFAULT_CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = (process.env.CORS_ORIGINS ?? DEFAULT_CORS_ORIGINS.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.includes('*')) {
  throw new Error('CORS_ORIGINS must list explicit origins; "*" is not allowed.');
}

server.register(cors, {
  origin: (origin, callback) => {
    // No Origin header: same-origin navigations, curl, server-to-server. The
    // auth hook is what protects these, not CORS.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Withhold the CORS headers so the browser blocks the response, rather
    // than erroring the request.
    server.log.warn({ origin }, 'Blocked cross-origin request from a non-allowlisted origin');
    return callback(null, false);
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Register Zod compilers
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Every /api/* route requires a bearer token unless explicitly made public.
// Registered before the route plugins so it covers all of them.
registerAuthGuard(server);

// Register routes
server.register(authRoutes, { prefix: '/api' });
server.register(applicationRoutes, { prefix: '/api' });
server.register(dashboardRoutes, { prefix: '/api' });
server.register(candidateRoutes, { prefix: '/api' });

// Global Error Handler requirement
server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      error: 'Validation Error',
      details: error.validation
    });
  }
  
  server.log.error(error);
  reply.status(500).send({ error: 'Internal Server Error' });
});

// Bind to loopback only by default: the API must not be reachable from the LAN
// or a VPN tunnel. Set HOST=0.0.0.0 explicitly, and only when running behind a
// reverse proxy that terminates TLS.
const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '127.0.0.1';

// Start the server
const start = async () => {
  try {
    if (usingPlaintextPassword) {
      server.log.warn('AUTH_PASSWORD is set in plaintext. Use AUTH_PASSWORD_HASH outside local development.');
    }
    if (HOST === '0.0.0.0' || HOST === '::') {
      server.log.warn(`Binding to ${HOST} exposes the API on every network interface. Only do this behind a reverse proxy.`);
    }
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server listening at http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

export { server };