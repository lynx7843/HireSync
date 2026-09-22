import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { ApplicationStatusEnum, CreateApplicationSchema, UpdateApplicationSchema } from '@hiresync/shared';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';

export async function applicationRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.post('/applications', {
    schema: {
      body: CreateApplicationSchema
    }
  }, async (request, reply) => {
    try {
      const application = await prisma.application.create({
        data: request.body,
        include: { candidate: true }
      });
      return reply.status(201).send(application);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        return reply.status(404).send({ error: 'Candidate not found' });
      }
      throw err;
    }
  });

  app.get('/applications', {
    schema: {
      querystring: z.object({
        search: z.string().optional(),
        status: ApplicationStatusEnum.optional(),
      })
    }
  }, async (request, reply) => {
    const { search, status } = request.query;

    const applications = await prisma.application.findMany({
      where: {
        deleted_at: null,
        // A soft-deleted candidate's applications go with them: without this
        // the "deleted" person is still listed by name.
        candidate: { deleted_at: null },
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
      params: z.object({ id: z.uuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params;

    const application = await prisma.application.findFirst({
      where: { id, deleted_at: null },
      include: { candidate: true }
    });

    if (!application) {
      return reply.status(404).send({ error: 'Application not found' });
    }

    return reply.send(application);
  });

  app.patch('/applications/:id', {
    schema: {
      params: z.object({ id: z.uuid() }),
      body: UpdateApplicationSchema
    }
  }, async (request, reply) => {
    const { id } = request.params;

    const nextStatus = request.body.status;

    try {
      const application = await prisma.$transaction(async (tx) => {
        // Read the current status so only a real transition stamps the clock.
        // Re-saving the same status, or editing notes on an old hire, must not
        // look like a fresh hire to the dashboard.
        const current = await tx.application.findFirst({
          where: { id, deleted_at: null },
          select: { status: true }
        });

        // A missing row leaves `current` null and the update below throws
        // P2025, which the handler already turns into a 404.
        return tx.application.update({
          where: { id, deleted_at: null },
          data: {
            ...request.body,
            ...(nextStatus !== undefined && nextStatus !== current?.status
              ? { status_changed_at: new Date() }
              : {})
          },
          include: { candidate: true }
        });
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
      params: z.object({ id: z.uuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      // Soft delete, matching candidates. Already-archived rows 404 like missing ones.
      await prisma.application.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return reply.status(404).send({ error: 'Application not found' });
      }
      throw err;
    }
  });
}