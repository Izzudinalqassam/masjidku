const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("🧹 Cleaning up dummy data...")

    try {
        // 1. Delete all transactions
        const deletedTransactions = await prisma.transaction.deleteMany({})
        console.log(`- Deleted ${deletedTransactions.count} transactions.`)

        // 2. Reset Mosque Balance and Name
        const updatedMosque = await prisma.mosque.updateMany({
            data: {
                openingBalance: 0,
                name: "Masjid Miftahul Huda"
            }
        })
        console.log(`- Reset mosque settings (Count: ${updatedMosque.count}).`)

        console.log("✅ Database cleaned! Dashboard is now empty and ready for real data.")
    } catch (e) {
        console.error("Error cleaning data:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
