import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    History as LuHistory,
    Landmark
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"

async function getDashboardData() {
    const mosque = await prisma.mosque.findFirst()

    if (!mosque) {
        return null
    }

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // 1. Monthly Summaries
    const monthlyTransactions = await prisma.transaction.findMany({
        where: {
            mosqueId: mosque.id,
            transactionDate: {
                gte: firstDayOfMonth,
            },
        },
    })

    const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const monthlyExpense = monthlyTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    // 2. Current Balance
    const allTransactions = await prisma.transaction.findMany({
        where: { mosqueId: mosque.id },
        select: { amount: true, type: true }
    })

    const totalIncome = allTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = allTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const currentBalance = Number(mosque.openingBalance) + totalIncome - totalExpense

    // 3. Separated Recent History
    const recentIncome = await prisma.transaction.findMany({
        where: { mosqueId: mosque.id, type: 'INCOME' },
        orderBy: { transactionDate: 'desc' },
        take: 5,
        include: { category: true }
    })

    const recentExpense = await prisma.transaction.findMany({
        where: { mosqueId: mosque.id, type: 'EXPENSE' },
        orderBy: { transactionDate: 'desc' },
        take: 5,
        include: { category: true }
    })

    // 4. Chart Data (Last 6 Months)
    const chartData = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = format(d, 'MMM', { locale: id })
        const start = new Date(d.getFullYear(), d.getMonth(), 1)
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)

        const monthTransactions = await prisma.transaction.findMany({
            where: {
                mosqueId: mosque.id,
                transactionDate: { gte: start, lte: end }
            }
        })

        chartData.push({
            name: monthName,
            pemasukan: monthTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0),
            pengeluaran: monthTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0)
        })
    }

    // 5. Category Analytics (Top 5 Expenses)
    const categoryTotals = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { mosqueId: mosque.id, type: 'EXPENSE', transactionDate: { gte: firstDayOfMonth } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5
    })

    const topCategories = await Promise.all(
        categoryTotals.map(async (ct) => {
            const category = await prisma.category.findUnique({ where: { id: ct.categoryId } })
            return {
                name: category?.name || 'Lainnya',
                value: Number(ct._sum.amount || 0)
            }
        })
    )

    return {
        currentBalance,
        monthlyIncome,
        monthlyExpense,
        recentIncome,
        recentExpense,
        chartData,
        topCategories
    }
}

export default async function DashboardPage() {
    const session = await auth()

    let userName = session?.user?.name || 'User'
    if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
        if (dbUser?.fullName) {
            userName = dbUser.fullName
        }
    }

    const data = await getDashboardData()

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Masjid Belum Tersedia</h2>
                    <p className="text-gray-600">Silakan setup data masjid terlebih dahulu</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ringkasan Keuangan</h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Assalamualaikum, <span className="text-emerald-600">{userName}</span>. Berikut laporan keuangan masjid Anda.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100/50 shadow-sm self-start md:self-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-emerald-700">Sistem Online</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden border-none shadow-md bg-white group hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Wallet className="w-16 h-16 text-emerald-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Saldo Kas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-gray-900">
                            {formatCurrency(data.currentBalance)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Landmark className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Liquid Fund</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-md bg-white group hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowUpCircle className="w-16 h-16 text-emerald-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pemasukan Bulan Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-emerald-600">
                            {formatCurrency(data.monthlyIncome)}
                        </div>
                        <p className="text-xs font-semibold text-gray-400 mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            Pendapatan operasional
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-md bg-white group hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowDownCircle className="w-16 h-16 text-rose-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pengeluaran Bulan Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-rose-600">
                            {formatCurrency(data.monthlyExpense)}
                        </div>
                        <p className="text-xs font-semibold text-gray-400 mt-2 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3 text-rose-500" />
                            Beban biaya berjalan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <DashboardCharts chartData={data.chartData} topCategories={data.topCategories} />

            {/* Separated History Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Income */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                </div>
                                <CardTitle className="text-lg font-bold">Pemasukan Terakhir</CardTitle>
                            </div>
                            <LuHistory className="w-4 h-4 text-gray-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data.recentIncome.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm italic">Belum ada pemasukan</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {data.recentIncome.map((t) => (
                                    <div key={t.id} className="p-4 flex items-center justify-between hover:bg-emerald-50/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{t.description}</span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">{t.category.name}</span>
                                                    • {format(new Date(t.transactionDate), 'dd MMM yyyy', { locale: id })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="font-black text-emerald-600 text-sm">
                                            +{formatCurrency(Number(t.amount))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Expense */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-100 rounded-xl">
                                    <TrendingDown className="w-5 h-5 text-rose-600" />
                                </div>
                                <CardTitle className="text-lg font-bold">Pengeluaran Terakhir</CardTitle>
                            </div>
                            <LuHistory className="w-4 h-4 text-gray-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data.recentExpense.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm italic">Belum ada pengeluaran</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {data.recentExpense.map((t) => (
                                    <div key={t.id} className="p-4 flex items-center justify-between hover:bg-rose-50/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{t.description}</span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">{t.category.name}</span>
                                                    • {format(new Date(t.transactionDate), 'dd MMM yyyy', { locale: id })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="font-black text-rose-600 text-sm">
                                            -{formatCurrency(Number(t.amount))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
