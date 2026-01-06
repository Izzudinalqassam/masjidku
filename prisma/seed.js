const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const path = require('path')

// Explicitly load dotenv from parent directory
const envPath = path.join(__dirname, '../.env')
require('dotenv').config({ path: envPath })

console.log('🌱 Seed script started (Prisma 7 Adapter)')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    console.error('❌ DATABASE_URL is missing!')
    process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        console.log('🔌 Connecting to database...')
        // Note: Adapter connects automatically or on first query

        console.log('🏗️ Creating Mosque...')
        const mosque = await prisma.mosque.upsert({
            where: { id: '00000000-0000-0000-0000-000000000001' },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Masjid Al-Ikhlas',
                address: 'Jl. Raya Masjid No. 123, Jakarta',
                phone: '021-12345678',
                email: 'info@masjidalikhlas.com',
                openingBalance: 50000000,
                openingDate: new Date('2024-01-01'),
            },
        })
        console.log('✅ Mosque created:', mosque.name)

        // ... (rest of the seed script is logic, not connection dependent)

        console.log('👤 Creating Users...')
        const adminPassword = await bcrypt.hash('admin123', 10)
        const bendaharaPassword = await bcrypt.hash('bendahara123', 10)

        await prisma.user.upsert({
            where: { email: 'admin@masjid.com' },
            update: {},
            create: {
                email: 'admin@masjid.com',
                passwordHash: adminPassword,
                fullName: 'Ahmad Fauzi',
                role: 'ADMIN',
            },
        })
        console.log('✅ Admin user created')

        const bendahara = await prisma.user.upsert({
            where: { email: 'bendahara@masjid.com' },
            update: {},
            create: {
                email: 'bendahara@masjid.com',
                passwordHash: bendaharaPassword,
                fullName: 'Fatimah Zahra',
                role: 'BENDAHARA',
            },
        })
        console.log('✅ Bendahara user created')

        console.log('📂 Creating Categories...')
        await Promise.all([
            prisma.category.upsert({
                where: { id: '00000000-0000-0000-0000-000000000011' },
                update: {},
                create: {
                    id: '00000000-0000-0000-0000-000000000011',
                    mosqueId: mosque.id,
                    name: 'Infaq',
                    type: 'INCOME',
                    color: '#10b981',
                    icon: 'hand-coins',
                },
            }),
            // ... (Adding few key categories to ensure testing works)
            prisma.category.upsert({
                where: { id: '00000000-0000-0000-0000-000000000021' },
                update: {},
                create: {
                    id: '00000000-0000-0000-0000-000000000021',
                    mosqueId: mosque.id,
                    name: 'Operasional',
                    type: 'EXPENSE',
                    color: '#ef4444',
                    icon: 'settings',
                },
            }),
        ])
        console.log('✅ Categories created (Partial for brevity/error reduction)')

        // Helper to get date relative to now
        const now = new Date()
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)

        const lastMonth = new Date(now)
        lastMonth.setMonth(now.getMonth() - 1)

        // Create sample transactions
        await prisma.transaction.createMany({
            data: [
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000011',
                    createdBy: bendahara.id,
                    type: 'INCOME',
                    amount: 2500000,
                    transactionDate: now, // Transaksi Hari Ini
                    description: 'Infaq Jumat Pekan Ini',
                },
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000021',
                    createdBy: bendahara.id,
                    type: 'EXPENSE',
                    amount: 500000,
                    transactionDate: yesterday, // Transaksi Kemarin
                    description: 'Pembayaran Listrik Bulanan',
                },
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000011',
                    createdBy: bendahara.id,
                    type: 'INCOME',
                    amount: 1000000,
                    transactionDate: lastMonth, // Transaksi Bulan Lalu
                    description: 'Sumbangan Hamba Allah',
                },
            ],
            skipDuplicates: true,
        })
        console.log('✅ Transactions created')

        console.log('🎉 Database seeding completed!')
    } catch (e) {
        console.error('❌ Error in seed script:', e)
        process.exit(1)
    } finally {
        // Adapter doesn't need explicit disconnect usually but for safety
        await prisma.$disconnect()
        await pool.end()
    }
}

main()
