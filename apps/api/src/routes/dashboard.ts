import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

export async function dashboardRoutes(server: FastifyInstance) {
  server.get('/dashboard', async (request, reply) => {
    // 1. Total counts
    const totalCandidates = await prisma.candidate.count({ where: { deleted_at: null } });
    const totalApplications = await prisma.application.count();

    // 2. Status distribution
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    // 3. Hired this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const hiredThisMonth = await prisma.application.count({
      where: { 
        status: 'hired',
        updated_at: { gte: startOfMonth }
      }
    });

    // 4. Rejection rate calculation
    const rejectedCount = statusCounts.find(s => s.status === 'rejected')?._count.status || 0;
    const rejectionRate = totalApplications > 0 
      ? ((rejectedCount / totalApplications) * 100).toFixed(1) 
      : 0;

    // 5. Latest applications
    const latestApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { candidate: { select: { name: true } } }
    });

    return reply.send({
      totalCandidates,
      totalApplications,
      statusDistribution: statusCounts,
      hiredThisMonth,
      rejectionRate: Number(rejectionRate),
      latestApplications
    });
  });
}