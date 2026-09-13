import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { 
  serializerCompiler, 
  validatorCompiler, 
  ZodTypeProvider,
  hasZodFastifySchemaValidationErrors
} from 'fastify-type-provider-zod';
import { pool, prisma } from './db.js';
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

// Cap requests per client IP across every route so the API can't be scraped or
// hammered. Registered before the route plugins so it covers all of them.
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
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

  // Let rate-limit rejections through as 429 instead of masking them as 500.
  if ((error as { statusCode?: number }).statusCode === 429) {
    return reply.status(429).send(error);
  }

  server.log.error(error);
  reply.status(500).send({ error: 'Internal Server Error' });
});

// Release database connections once the HTTP server has stopped accepting and
// finished in-flight requests.
server.addHook('onClose', async () => {
  await prisma.$disconnect();
  await pool.end();
});

// Graceful shutdown on Ctrl+C / container stop. A second signal forces exit in
// case a request or connection hangs.
let shuttingDown = false;
const shutdown = async (signal: NodeJS.Signals) => {
  if (shuttingDown) {
    server.log.warn(`Received ${signal} again, forcing exit.`);
    process.exit(1);
  }
  shuttingDown = true;
  server.log.info(`Received ${signal}, shutting down.`);
  try {
    await server.close();
    process.exit(0);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

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