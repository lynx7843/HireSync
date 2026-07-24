import { z } from 'zod';
import { Prisma } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';

export async function applicationRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.get('/applications', {
    schema: {
      querystring: z.object({
        search: z.string().optional(),
        status: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']).optional(),
      })
    }
  }, async (request, reply) => {
    const { search, status } = request.query;

    const applications = await prisma.application.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search ? {
          OR: [
            // Search Application fields
            { job_title: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
            { source: { contains: search, mode: 'insensitive' } },
            // JOIN Search Candidate fields
            { candidate: {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { location: { contains: search, mode: 'insensitive' } }
                ]
              }
            }
          ]
        } : {})
      },
      include: {
        candidate: {
          select: { name: true, email: true } // Only pull what frontend needs
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return reply.send(applications);
  });

  app.get('/applications/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { candidate: true }
    });

    if (!application) {
      return reply.status(404).send({ error: 'Application not found' });
    }

    return reply.send(application);
  });

  app.patch('/applications/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        job_title: z.string().min(1).optional(),
        company: z.string().min(1).optional(),
        status: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']).optional(),
        applied_at: z.coerce.date().optional(),
        salary_expectation: z.number().int().nullable().optional(),
        source: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      const application = await prisma.application.update({
        where: { id },
        data: request.body,
        include: { candidate: true }
      });
      return reply.send(application);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return reply.status(404).send({ error: 'Application not found' });
      }
      throw err;
    }
  });

  app.delete('/applications/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      await prisma.application.delete({ where: { id } });
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return reply.status(404).send({ error: 'Application not found' });
      }
      throw err;
    }
  });
}