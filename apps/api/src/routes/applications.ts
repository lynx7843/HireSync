import { z } from 'zod';
import { server } from '../server.js';
import { prisma } from '../db.js';

export async function applicationRoutes() {
  server.get('/applications', {
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
  
  // (You will also add your POST, PATCH, and DELETE application routes here)
}