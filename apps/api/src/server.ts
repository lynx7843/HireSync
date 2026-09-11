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

server.register(cors, {
  origin: true, // Allow frontend connections
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

// Start the server
const start = async () => {
  try {
    if (usingPlaintextPassword) {
      server.log.warn('AUTH_PASSWORD is set in plaintext. Use AUTH_PASSWORD_HASH outside local development.');
    }
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log(`Server listening at http://localhost:3001`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

export { server };