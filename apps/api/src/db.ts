import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Fail fast: without this, a missing URL only surfaces on the first query as
// the misleading pg error "SASL: client password must be a string".
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'Missing required environment variable DATABASE_URL. Set it in apps/api/.env or the environment before starting the API.'
  );
}
// Exported so shutdown can end it: the adapter does not close a pool it was handed.
export const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });