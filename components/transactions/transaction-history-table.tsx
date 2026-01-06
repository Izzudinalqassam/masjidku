"use client"

import { Transaction, Category, User } from "@prisma/client"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    ArrowUpCircle,
    ArrowDownCircle,
    User as UserIcon,
    Clock
} from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DetailedTransaction extends Transaction {
    category: Category
    user: User | null
}

interface TransactionHistoryTableProps {
    transactions: DetailedTransaction[]
    type: "INCOME" | "EXPENSE"
}

export function TransactionHistoryTable({ transactions, type }: TransactionHistoryTableProps) {
    const isIncome = type === "INCOME"

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Belum ada riwayat transaksi {isIncome ? 'pemasukan' : 'pengeluaran'}.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow>
                        <TableHead className="w-[120px]">Tanggal</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="hidden md:table-cell text-right">Nominal</TableHead>
                        <TableHead className="hidden lg:table-cell">Input Oleh</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((t) => (
                        <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="font-medium text-xs md:text-sm">
                                {format(new Date(t.transactionDate), "dd/MM/yy")}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900 text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                                        {t.category.name}
                                    </span>
                                    <span className="text-[10px] md:text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                                        {t.description}
                                    </span>
                                    {/* Mobile Only Amount */}
                                    <span className={cn(
                                        "md:hidden text-[10px] font-bold mt-1",
                                        isIncome ? "text-emerald-600" : "text-red-600"
                                    )}>
                                        Rp {Number(t.amount).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-right">
                                <span className={cn(
                                    "font-bold",
                                    isIncome ? "text-emerald-600" : "text-red-600"
                                )}>
                                    Rp {Number(t.amount).toLocaleString('id-ID')}
                                </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="p-1 bg-gray-100 rounded-full">
                                        <UserIcon className="w-3 h-3 text-gray-500" />
                                    </div>
                                    <span className="truncate max-w-[80px]">
                                        {t.user?.fullName?.split(' ')[0] || "System"}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
