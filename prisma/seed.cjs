const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const path = require('path')

// Explicitly load dotenv from parent directory
require('dotenv').config({ path: path.join(__dirname, '../.env') })

console.log('🌱 Seed script started (CJS)')

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
    console.error('❌ DATABASE_URL is missing!')
    console.log('Current env:', process.env)
    process.exit(1)
}
console.log('✅ DATABASE_URL found')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
})

async function main() {
    try {
        console.log('🔌 Connecting to database...')
        await prisma.$connect()
        console.log('✅ Connected!')

        console.log('🧹 Cleaning up old data (optional)...')
        // await prisma.transaction.deleteMany()
        // await prisma.category.deleteMany()
        // await prisma.mosque.deleteMany()
        // await prisma.user.deleteMany()

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

        console.log('👤 Creating Users...')
        const adminPassword = await bcrypt.hash('admin123', 10)
        const bendaharaPassword = await bcrypt.hash('bendahara123', 10)

        const admin = await prisma.user.upsert({
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
        const categories = await Promise.all([
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
            prisma.category.upsert({
                where: { id: '00000000-0000-0000-0000-000000000012' },
                update: {},
                create: {
                    id: '00000000-0000-0000-0000-000000000012',
                    mosqueId: mosque.id,
                    name: 'Shodaqoh',
                    type: 'INCOME',
                    color: '#10b981',
                    icon: 'heart-handshake',
                },
            }),
            prisma.category.upsert({
                where: { id: '00000000-0000-0000-0000-000000000013' },
                update: {},
                create: {
                    id: '00000000-0000-0000-0000-000000000013',
                    mosqueId: mosque.id,
                    name: 'Wakaf',
                    type: 'INCOME',
                    color: '#10b981',
                    icon: 'building',
                },
            }),
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
            prisma.category.upsert({
                where: { id: '00000000-0000-0000-0000-000000000022' },
                update: {},
                create: {
                    id: '00000000-0000-0000-0000-000000000022',
                    mosqueId: mosque.id,
                    name: 'Kegiatan',
                    type: 'EXPENSE',
                    color: '#ef4444',
                    icon: 'calendar',
                },
            }),
            prisma.category.upsert({
                where: { id: '00000000-0000-0000-0000-000000000023' },
                update: {},
                create: {
                    id: '00000000-0000-0000-0000-000000000023',
                    mosqueId: mosque.id,
                    name: 'Pembangunan',
                    type: 'EXPENSE',
                    color: '#ef4444',
                    icon: 'hammer',
                },
            }),
        ])
        console.log('✅ Categories created')

        console.log('💸 Creating Transactions...')
        await prisma.transaction.createMany({
            data: [
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000011',
                    createdBy: bendahara.id,
                    type: 'INCOME',
                    amount: 2500000,
                    transactionDate: new Date('2025-12-27'),
                    description: 'Infaq Jumat',
                },
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000012',
                    createdBy: bendahara.id,
                    type: 'INCOME',
                    amount: 1500000,
                    transactionDate: new Date('2025-12-25'),
                    description: 'Shodaqoh Jamaah',
                },
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000021',
                    createdBy: bendahara.id,
                    type: 'EXPENSE',
                    amount: 500000,
                    transactionDate: new Date('2025-12-26'),
                    description: 'Bayar Listrik Bulan Desember',
                },
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000021',
                    createdBy: bendahara.id,
                    type: 'EXPENSE',
                    amount: 300000,
                    transactionDate: new Date('2025-12-24'),
                    description: 'Bayar Air PDAM',
                },
                {
                    mosqueId: mosque.id,
                    categoryId: '00000000-0000-0000-0000-000000000022',
                    createdBy: bendahara.id,
                    type: 'EXPENSE',
                    amount: 750000,
                    transactionDate: new Date('2025-12-20'),
                    description: 'Konsumsi Kajian Rutin',
                },
            ],
            skipDuplicates: true,
        })
        console.log('✅ Transactions created')

        console.log('🎉 Database seeding completed!')
    } catch (e) {
        console.error('❌ Error in seed script:', e)
        console.error('Stack:', e.stack)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
