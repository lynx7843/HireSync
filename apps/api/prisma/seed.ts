import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Initialize the PostgreSQL driver adapter
const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter })

type Status = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'

// Seeded PRNG (mulberry32) so every run produces the same dashboard.
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = makeRng(20260910)
const int = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1))
const pick = <T>(items: readonly T[]) => items[Math.floor(rng() * items.length)]

function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

const NAMES = [
  'Amara Okafor', 'Ben Whitfield', 'Priya Raghunathan', 'Diego Salazar',
  'Elena Vasquez', 'Marcus Chen', 'Nadia Haddad', 'Oliver Brandt',
  'Sofia Moreau', 'Rahul Menon', 'Grace Lindqvist', 'Tomas Novak',
  'Yuki Tanaka', 'Isabelle Fournier', 'Samuel Adeyemi', 'Clara Bergstrom',
  'Hassan Karimi', 'Wei Zhang', 'Lucia Ferrari', 'Noah Kowalski',
  'Aisha Rahman', 'Peter Osei', 'Mira Kaplan', 'Daniel Petrov',
  'Renata Alves', 'Jonas Lindgren',
]

const LOCATIONS = [
  'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA',
  'Chicago, IL', 'Denver, CO', 'Boston, MA', 'Remote (US)',
  'Toronto, ON', 'Berlin, DE', 'London, UK', 'Lisbon, PT',
]

const COMPANIES = [
  'Northwind Labs', 'Acme Robotics', 'Vertex Health', 'Lumen Analytics',
  'Harbor Financial', 'Cobalt Systems', 'Grove Retail', 'Pinnacle Media',
  'Ridgeline Energy', 'Beacon Logistics',
]

// [title, base salary] - keeps salary_expectation correlated with seniority.
const ROLES: readonly (readonly [string, number])[] = [
  ['Junior Frontend Engineer', 85_000],
  ['Frontend Engineer', 120_000],
  ['Senior Frontend Engineer', 155_000],
  ['Backend Engineer', 130_000],
  ['Senior Backend Engineer', 165_000],
  ['Full Stack Engineer', 135_000],
  ['Staff Software Engineer', 195_000],
  ['Data Engineer', 140_000],
  ['DevOps Engineer', 145_000],
  ['Engineering Manager', 180_000],
  ['Product Designer', 115_000],
  ['QA Engineer', 95_000],
]

const SOURCES = ['LinkedIn', 'Referral', 'Job Board', 'Careers Page', 'Recruiter', 'Conference']

const NOTES = [
  'Strong systems background, keen on distributed work.',
  'Great culture fit; needs visa sponsorship.',
  'Take-home submission was excellent.',
  'Passed on comp expectations for now.',
  'Wants to hear back before end of quarter.',
  'Referred by an engineer on the platform team.',
]

// Funnel-shaped distribution so the pipeline chart has six meaningfully
// different bars instead of one. Every status gets at least MIN_PER_STATUS.
const STATUS_WEIGHTS: readonly (readonly [Status, number])[] = [
  ['applied', 0.28],
  ['screening', 0.18],
  ['interview', 0.16],
  ['offer', 0.08],
  ['hired', 0.1],
  ['rejected', 0.2],
]

const MIN_PER_STATUS = 2

function buildStatusPool(total: number): Status[] {
  const counts: [Status, number][] = STATUS_WEIGHTS.map(([status, weight]) => [
    status,
    Math.max(MIN_PER_STATUS, Math.floor(weight * total)),
  ])

  const sum = () => counts.reduce((acc, [, n]) => acc + n, 0)

  // Reconcile rounding against `total`, always taking from / giving to the
  // largest bucket so no status can be squeezed below MIN_PER_STATUS.
  while (sum() < total) {
    counts.sort((a, b) => b[1] - a[1])
    counts[0][1] += 1
  }
  while (sum() > total) {
    counts.sort((a, b) => b[1] - a[1])
    const shrinkable = counts.find(([, n]) => n > MIN_PER_STATUS)
    if (!shrinkable) break
    shrinkable[1] -= 1
  }

  const pool: Status[] = []
  for (const [status, n] of counts) {
    for (let i = 0; i < n; i++) pool.push(status)
  }
  return shuffle(pool)
}

const TODAY = new Date()
const YEAR = TODAY.getUTCFullYear()
const MONTH = TODAY.getUTCMonth()
const DAY_OF_MONTH = TODAY.getUTCDate()

/** UTC midnight `n` days before today - `applied_at` is a @db.Date column. */
function daysAgo(n: number): Date {
  return new Date(Date.UTC(YEAR, MONTH, DAY_OF_MONTH - n))
}

// How far back an application of each status plausibly started. Later-stage and
// terminal statuses skew older, which spreads applied_at across ~6 months.
const AGE_RANGE: Record<Status, [number, number]> = {
  applied: [0, 25],
  screening: [5, 45],
  interview: [14, 75],
  offer: [25, 100],
  hired: [35, 175],
  rejected: [20, 175],
}

let recentHires = 0

function appliedAtFor(status: Status): Date {
  // Guarantee a couple of hires land inside the current month so the
  // "Hired this month" tile is never a flat zero.
  if (status === 'hired' && recentHires < 2) {
    recentHires++
    return daysAgo(Math.min(recentHires * 6, DAY_OF_MONTH - 1))
  }
  const [min, max] = AGE_RANGE[status]
  return daysAgo(int(min, max))
}

function salaryFor(base: number): number | null {
  // ~1 in 6 applications has no stated expectation.
  if (rng() < 0.17) return null
  return base + int(-8, 12) * 1000
}

function slugFor(name: string, index: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z]+/g, '.')
    .replace(/^\.|\.$/g, '')
  return `${slug || 'candidate'}${index}`
}

async function main() {
  console.log('Seeding database...')

  // Clear out rows from any previous seed run so re-seeding doesn't fail on the
  // unique email constraint. Scoped to the seed's own emails so candidates added
  // through the app are left alone. Applications have no cascade, so go first.
  const seedEmails = NAMES.map((name, i) => `${slugFor(name, i + 1)}@example.com`)
  await prisma.$transaction([
    prisma.application.deleteMany({ where: { candidate: { email: { in: seedEmails } } } }),
    prisma.candidate.deleteMany({ where: { email: { in: seedEmails } } }),
  ])

  // Two candidates are soft-deleted so the dashboard's `deleted_at: null`
  // filter is actually exercised.
  const SOFT_DELETED = new Set([7, 19])

  // Decide how many applications each candidate gets up front, so the status
  // pool can be sized to the exact total.
  const appCounts = NAMES.map(() => int(1, 4))
  const totalApplications = appCounts.reduce((a, b) => a + b, 0)
  const statusPool = buildStatusPool(totalApplications)

  let cursor = 0

  for (let i = 0; i < NAMES.length; i++) {
    const name = NAMES[i]
    const slug = slugFor(name, i + 1)
    const usedRoles = new Set<string>()

    const applications = Array.from({ length: appCounts[i] }).map(() => {
      const status = statusPool[cursor++]

      // Avoid giving one candidate the same role twice.
      let role = pick(ROLES)
      for (let attempt = 0; attempt < 5 && usedRoles.has(role[0]); attempt++) role = pick(ROLES)
      usedRoles.add(role[0])

      return {
        job_title: role[0],
        company: pick(COMPANIES),
        status,
        applied_at: appliedAtFor(status),
        salary_expectation: salaryFor(role[1]),
        source: rng() < 0.12 ? null : pick(SOURCES),
        notes: rng() < 0.65 ? null : pick(NOTES),
      }
    })

    await prisma.candidate.create({
      data: {
        name,
        email: `${slug}@example.com`,
        location: pick(LOCATIONS),
        phone: `555-0${String(100 + i).padStart(3, '0')}`,
        linkedin_url: rng() < 0.3 ? null : `https://linkedin.com/in/${slug}`,
        deleted_at: SOFT_DELETED.has(i) ? daysAgo(int(3, 40)) : null,
        applications: { create: applications },
      },
    })
  }

  const summary = statusPool.reduce<Record<string, number>>((acc, status) => {
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  console.log(
    `Seeding complete! ${NAMES.length} candidates ` +
      `(${SOFT_DELETED.size} soft-deleted), ${totalApplications} applications.`
  )
  console.table(summary)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
