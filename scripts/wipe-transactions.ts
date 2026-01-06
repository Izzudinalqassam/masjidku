import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🧹 Cleaning up dummy data...")

    // 1. Delete all transactions
    const deletedTransactions = await prisma.transaction.deleteMany({})
    console.log(`- Deleted ${deletedTransactions.count} transactions.`)

    // 2. Reset Mosque Balance and Name
    // We assume there is only one mosque, or we update all
    const updatedMosque = await prisma.mosque.updateMany({
        data: {
            openingBalance: 0,
            name: "Masjid Miftahul Huda" // Set to the requested name
        }
    })
    console.log(`- Reset mosque settings (Count: ${updatedMosque.count}).`)

    console.log("✅ Database cleaned! Dashboard is now empty and ready for real data.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
