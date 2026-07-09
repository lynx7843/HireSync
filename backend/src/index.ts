import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';

const server = Fastify();

// Register the database connection
server.register(fastifyPostgres, {
  connectionString: 'postgres://postgres:mysecretpassword@localhost:5432/postgres'
});

server.get('/', async (req, reply) => {
  return { hello: 'world' };
});

server.get('/db-test', async (req, reply) => {
  const client = await server.pg.connect();
  try {
    const { rows } = await client.query('SELECT now()');
    return rows;
  } finally {
    client.release();
  }
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Backend server listening at ${address}`);
});