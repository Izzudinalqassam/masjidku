import { getCategories, getRecentTransactionsByType } from "@/lib/actions/transactions"
import { TransactionHistoryHub } from "@/components/transactions/transaction-list-hub"

import { startOfMonth, endOfMonth } from "date-fns"

interface PageProps {
    searchParams: Promise<{
        income_page?: string
        expense_page?: string
        from?: string
        to?: string
    }>
}

const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d)
}

export default async function NewTransactionPage({ searchParams }: PageProps) {
    const params = await searchParams
    const incomePage = Number(params.income_page) || 1
    const expensePage = Number(params.expense_page) || 1
    const fromDate = params.from ? parseLocalDate(params.from) : undefined
    const toDate = params.to ? parseLocalDate(params.to) : undefined
    const limit = 10

    const [categories, recentIncome, recentExpense] = await Promise.all([
        getCategories(),
        getRecentTransactionsByType("INCOME", limit, incomePage, fromDate, toDate),
        getRecentTransactionsByType("EXPENSE", limit, expensePage, fromDate, toDate)
    ])

    return (
        <TransactionHistoryHub
            categories={categories}
            recentIncome={recentIncome as any}
            recentExpense={recentExpense as any}
            incomePage={incomePage}
            expensePage={expensePage}
        />
    )
}
