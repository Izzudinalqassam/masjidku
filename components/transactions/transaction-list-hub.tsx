"use client"

import { useState } from "react"
import { Category } from "@prisma/client"
import {
    Plus,
    ArrowUpCircle,
    ArrowDownCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { TransactionForm } from "./transaction-form"
import { TransactionHistoryTable } from "./transaction-history-table"
import { TransactionFilters } from "./transaction-filters"
import { CustomPagination } from "@/components/ui/pagination-custom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TransactionHistoryHubProps {
    categories: Category[]
    recentIncome: { data: any[], totalPages: number, totalCount: number }
    recentExpense: { data: any[], totalPages: number, totalCount: number }
    incomePage: number
    expensePage: number
}

export function TransactionHistoryHub({
    categories,
    recentIncome,
    recentExpense,
    incomePage,
    expensePage
}: TransactionHistoryHubProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Riwayat Transaksi</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Kelola dan pantau semua aliran dana masjid secara real-time.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <TransactionFilters />

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 h-10 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95">
                                <Plus className="w-5 h-5 mr-2" />
                                <span className="hidden sm:inline">Tambah Transaksi</span>
                                <span className="sm:hidden">Tambah</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                            <SheetHeader className="mb-6 sr-only">
                                <SheetTitle>Input Transaksi Baru</SheetTitle>
                                <SheetDescription>
                                    Masukkan detail transaksi pemasukan atau pengeluaran.
                                </SheetDescription>
                            </SheetHeader>
                            <TransactionForm
                                categories={categories}
                                onSuccess={() => setIsOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <TabsList className="bg-gray-100/80 p-1 h-11 rounded-xl">
                        <TabsTrigger value="all" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Semua</TabsTrigger>
                        <TabsTrigger value="income" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Pemasukan</TabsTrigger>
                        <TabsTrigger value="expense" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Pengeluaran</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all" className="space-y-8 outline-none mt-0">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
                                    <h3 className="font-bold text-gray-800">Pemasukan</h3>
                                </div>
                                <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded-md">Total: {recentIncome.totalCount}</span>
                            </div>
                            <TransactionHistoryTable transactions={recentIncome.data} type="INCOME" />
                            <CustomPagination totalPages={recentIncome.totalPages} currentPage={incomePage} paramKey="income_page" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <ArrowDownCircle className="w-5 h-5 text-red-500" />
                                    <h3 className="font-bold text-gray-800">Pengeluaran</h3>
                                </div>
                                <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded-md">Total: {recentExpense.totalCount}</span>
                            </div>
                            <TransactionHistoryTable transactions={recentExpense.data} type="EXPENSE" />
                            <CustomPagination totalPages={recentExpense.totalPages} currentPage={expensePage} paramKey="expense_page" />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="income" className="outline-none mt-0">
                    <div className="space-y-4 max-w-5xl mx-auto">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
                                <h3 className="font-bold text-gray-800">Riwayat Pemasukan</h3>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Data: {recentIncome.totalCount}</span>
                        </div>
                        <TransactionHistoryTable transactions={recentIncome.data} type="INCOME" />
                        <CustomPagination totalPages={recentIncome.totalPages} currentPage={incomePage} paramKey="income_page" />
                    </div>
                </TabsContent>

                <TabsContent value="expense" className="outline-none mt-0">
                    <div className="space-y-4 max-w-5xl mx-auto">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <ArrowDownCircle className="w-5 h-5 text-red-500" />
                                <h3 className="font-bold text-gray-800">Riwayat Pengeluaran</h3>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Data: {recentExpense.totalCount}</span>
                        </div>
                        <TransactionHistoryTable transactions={recentExpense.data} type="EXPENSE" />
                        <CustomPagination totalPages={recentExpense.totalPages} currentPage={expensePage} paramKey="expense_page" />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
