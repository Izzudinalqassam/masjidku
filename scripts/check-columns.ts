
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // Just try to find one event and see the object structure
        const event = await prisma.event.findFirst()
        console.log("Event structure:", event)
    } catch (e) {
        console.error("Error querying event:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
