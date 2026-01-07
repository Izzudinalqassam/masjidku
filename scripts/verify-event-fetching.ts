
import { config } from "dotenv"
config()
import { prisma } from "../lib/prisma"

// Mock getEventById since we can't import server actions appropriately in standalone scripts easily without next setup sometimes,
// but actually we can try to import if environment allows. 
// For safety/speed, I'll replicate the logic.

async function mockGetEventById(id: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                mosque: {
                    select: {
                        id: true,
                        name: true,
                        address: true
                    }
                }
            }
        })
        return event
    } catch (error) {
        console.error("Error fetching event by ID:", error)
        return null
    }
}

async function main() {
    console.log("Fetching all events...")
    const events = await prisma.event.findMany({
        take: 5
    })
    console.log(`Found ${events.length} events.`)

    for (const event of events) {
        console.log(`Testing fetch for Event ID: ${event.id}`)
        const fetched = await mockGetEventById(event.id)
        if (fetched) {
            console.log(`[SUCCESS] Fetched event: ${fetched.title}`)
        } else {
            console.error(`[FAILURE] Could not fetch event with ID: ${event.id}`)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
