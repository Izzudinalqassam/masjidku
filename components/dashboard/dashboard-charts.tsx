"use client"

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface DashboardChartsProps {
    chartData: any[]
    topCategories: any[]
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6']

export function DashboardCharts({ chartData, topCategories }: DashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Chart */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Tren Keuangan 6 Bulan</CardTitle>
                    <CardDescription>Grafik perbandingan pemasukan dan pengeluaran</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 11 }}
                                tickFormatter={(value) => `Rp ${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => formatCurrency(value ?? 0)}
                            />
                            <Area
                                type="monotone"
                                dataKey="pemasukan"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                            />
                            <Area
                                type="monotone"
                                dataKey="pengeluaran"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorExpense)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Pengeluaran Terbesar</CardTitle>
                    <CardDescription>Berdasarkan kategori bulan ini</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    {topCategories.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Belum ada pengeluaran
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={topCategories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {topCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(value ?? 0)}
                                    contentStyle={{ borderRadius: '12px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="vertical"
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
