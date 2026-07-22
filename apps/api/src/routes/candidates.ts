import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';

export async function candidateRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.get('/candidates', {
    schema: {
      querystring: z.object({
        search: z.string().optional(),
        status: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']).optional(),
        location: z.string().optional(),
      })
    }
  }, async (request, reply) => {
    const { search, status, location } = request.query;

    const candidates = await prisma.candidate.findMany({
      where: {
        deleted_at: null,
        ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
        ...(status ? { applications: { some: { status } } } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        applications: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: { job_title: true, status: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return reply.send(candidates);
  });

  app.get('/candidates/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params;

    const candidate = await prisma.candidate.findFirst({
      where: { id, deleted_at: null },
      include: {
        applications: { orderBy: { applied_at: 'desc' } }
      }
    });

    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate not found' });
    }

    return reply.send(candidate);
  });
}
