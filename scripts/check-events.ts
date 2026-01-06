
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

// Mock env for standalone script if needed
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        const events = await prisma.event.findMany()
        console.log('--- ALL EVENTS ---')
        console.log(JSON.stringify(events, null, 2))

        const published = await prisma.event.findMany({
            where: { isPublished: true }
        })
        console.log('--- PUBLISHED EVENTS ---')
        console.log(JSON.stringify(published, null, 2))
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

main()
