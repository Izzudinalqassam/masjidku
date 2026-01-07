
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const event = await prisma.event.findFirst({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                startDate: true,
                category: true,
                isPublished: true,
                createdAt: true
            }
        })
        console.log("Latest created event:", event)
        console.log("Current server time:", new Date().toISOString())
    } catch (e) {
        console.error("Error querying event:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
