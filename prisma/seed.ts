import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create Mosque
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

    // Create Users
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
    console.log('✅ Admin user created:', admin.email)

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
    console.log('✅ Bendahara user created:', bendahara.email)

    // Create Categories - Income
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
        // Expense categories
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
    console.log('✅ Categories created:', categories.length)

    // Create sample transactions
    const transactions = await Promise.all([
        prisma.transaction.create({
            data: {
                mosqueId: mosque.id,
                categoryId: '00000000-0000-0000-0000-000000000011',
                createdBy: bendahara.id,
                type: 'INCOME',
                amount: 2500000,
                transactionDate: new Date('2025-12-27'),
                description: 'Infaq Jumat',
            },
        }),
        prisma.transaction.create({
            data: {
                mosqueId: mosque.id,
                categoryId: '00000000-0000-0000-0000-000000000012',
                createdBy: bendahara.id,
                type: 'INCOME',
                amount: 1500000,
                transactionDate: new Date('2025-12-25'),
                description: 'Shodaqoh Jamaah',
            },
        }),
        prisma.transaction.create({
            data: {
                mosqueId: mosque.id,
                categoryId: '00000000-0000-0000-0000-000000000021',
                createdBy: bendahara.id,
                type: 'EXPENSE',
                amount: 500000,
                transactionDate: new Date('2025-12-26'),
                description: 'Bayar Listrik Bulan Desember',
            },
        }),
        prisma.transaction.create({
            data: {
                mosqueId: mosque.id,
                categoryId: '00000000-0000-0000-0000-000000000021',
                createdBy: bendahara.id,
                type: 'EXPENSE',
                amount: 300000,
                transactionDate: new Date('2025-12-24'),
                description: 'Bayar Air PDAM',
            },
        }),
        prisma.transaction.create({
            data: {
                mosqueId: mosque.id,
                categoryId: '00000000-0000-0000-0000-000000000022',
                createdBy: bendahara.id,
                type: 'EXPENSE',
                amount: 750000,
                transactionDate: new Date('2025-12-20'),
                description: 'Konsumsi Kajian Rutin',
            },
        }),
    ])
    console.log('✅ Sample transactions created:', transactions.length)

    console.log('🎉 Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
