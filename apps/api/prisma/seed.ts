import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Initialize the PostgreSQL driver adapter
const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')
  
  // Loop to create 10 candidates
  for (let i = 1; i <= 10; i++) {
    // Generate a random number between 2 and 4 for applications
    const appCount = Math.floor(Math.random() * 3) + 2;
    
    await prisma.candidate.create({
      data: {
        name: `Candidate ${i}`,
        email: `candidate${i}@example.com`,
        location: 'New York, NY',
        phone: '555-0100',
        applications: {
          create: Array.from({ length: appCount }).map((_, j) => ({
            job_title: `Software Engineer Role ${j + 1}`,
            company: `Tech Corp ${j + 1}`,
            status: 'applied',
            applied_at: new Date(),
            salary_expectation: 100000 + (j * 10000),
          }))
        }
      }
    })
  }
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })