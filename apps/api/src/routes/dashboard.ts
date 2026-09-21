import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

export async function dashboardRoutes(server: FastifyInstance) {
  server.get('/dashboard', async (request, reply) => {
    // 1. Total counts
    const totalCandidates = await prisma.candidate.count({ where: { deleted_at: null } });
    // Every application figure below excludes applications whose candidate is
    // soft-deleted, so the counts are computed on the same population as
    // totalCandidates and a deleted person never surfaces by name.
    const visibleApplications = { deleted_at: null, candidate: { deleted_at: null } };
    const totalApplications = await prisma.application.count({ where: visibleApplications });

    // 2. Status distribution
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: visibleApplications,
      _count: { status: true }
    });

    // 3. Hired this month
    // Counted on status_changed_at, not updated_at: updated_at moves on any
    // edit, so editing an old hire's notes used to count it as a hire today.
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const hiredThisMonth = await prisma.application.count({
      where: { 
        ...visibleApplications,
        status: 'hired',
        status_changed_at: { gte: startOfMonth }
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
      where: visibleApplications,
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