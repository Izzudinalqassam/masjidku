"use client"

import { useMemo } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface DailyData {
    date: string
    income: number
    expense: number
}

interface OverviewChartProps {
    data: DailyData[]
}

export function OverviewChart({ data }: OverviewChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Arus Kas Harian</CardTitle>
                <CardDescription>Pemasukan vs Pengeluaran dalam periode terpilih</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            stroke="#6B7280"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis
                            stroke="#6B7280"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
                            tickMargin={10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: any) => [`Rp ${(value ?? 0).toLocaleString("id-ID")}`, ""]}
                            cursor={{ fill: '#F3F4F6' }}
                        />
                        <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={Math.max(10, 40 - data.length)} />
                        <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={Math.max(10, 40 - data.length)} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

interface BreakdownData {
    name: string
    value: number
    color: string
    [key: string]: string | number
}

interface CategoryPieChartProps {
    title: string
    data: BreakdownData[]
    total: number
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for small segments

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function CategoryPieChart({ title, data, total }: CategoryPieChartProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Total: Rp {total.toLocaleString('id-ID')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {data.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Belum ada data
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    isAnimationActive={false}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || '#94a3b8'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => `Rp ${(value ?? 0).toLocaleString("id-ID")}`} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
