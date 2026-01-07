import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    console.log("Checking events and images...")
    const events = await prisma.event.findMany({
        where: { imageUrl: { not: null } }
    })

    console.log(`Found ${events.length} events with images.`)

    for (const event of events) {
        if (!event.imageUrl) continue

        const relativePath = event.imageUrl
        const absolutePath = path.join(process.cwd(), 'public', relativePath)

        const exists = fs.existsSync(absolutePath)
        console.log(`Event: ${event.title}`)
        console.log(`  URL: ${relativePath}`)
        console.log(`  Path: ${absolutePath}`)
        console.log(`  Exists: ${exists ? 'YES' : 'NO'}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
