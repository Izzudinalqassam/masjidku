import { getFinancialSummary, getDailyChartData, getCategoryBreakdown } from "@/lib/actions/reports"
import { OverviewChart, CategoryPieChart } from "@/components/reports/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { redirect } from "next/navigation"
import { ExportButton } from "@/components/reports/export-button"

import { startOfMonth, endOfMonth, format } from "date-fns"
import { id } from "date-fns/locale"
import { ReportFilters } from "@/components/reports/report-filters"

export const dynamic = "force-dynamic"

const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d)
}

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string }>
}) {
    const params = await searchParams
    const fromDate = params.from ? parseLocalDate(params.from) : startOfMonth(new Date())
    const toDate = params.to ? parseLocalDate(params.to) : endOfMonth(new Date())

    // Data Fetching
    const summary = await getFinancialSummary(fromDate, toDate)
    const dailyData = await getDailyChartData(fromDate, toDate)
    const expenseBreakdown = await getCategoryBreakdown(fromDate, toDate, "EXPENSE")
    const incomeBreakdown = await getCategoryBreakdown(fromDate, toDate, "INCOME")

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Laporan Keuangan</h1>
                    <p className="text-muted-foreground mt-1">
                        Periode {format(fromDate, 'dd MMM yyyy', { locale: id })} - {format(toDate, 'dd MMM yyyy', { locale: id })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ReportFilters />
                    <ExportButton startDate={fromDate} endDate={toDate} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pemasukan
                        </CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            Rp {summary.income.toLocaleString("id-ID")}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {summary.incomeChange > 0 ? "+" : ""}
                            {summary.incomeChange.toFixed(1)}% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pengeluaran
                        </CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            Rp {summary.expense.toLocaleString("id-ID")}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {summary.expenseChange > 0 ? "+" : ""}
                            {summary.expenseChange.toFixed(1)}% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Saldo Bersih
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            Rp {summary.balance.toLocaleString("id-ID")}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Bulan ini
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Main Bar Chart */}
                <OverviewChart data={dailyData} />

                {/* Side Pie Chart */}
                <CategoryPieChart
                    title="Breakdown Pengeluaran"
                    data={expenseBreakdown}
                    total={summary.expense}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <CategoryPieChart
                    title="Breakdown Pemasukan"
                    data={incomeBreakdown}
                    total={summary.income}
                />
            </div>
        </div>
    )
}
