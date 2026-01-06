"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfMonth, endOfMonth, subMonths, format, eachDayOfInterval, startOfDay, endOfDay } from "date-fns"
import { id } from "date-fns/locale"

export async function getFinancialSummary(startDate: Date, endDate: Date) {
    const transactions = await prisma.transaction.findMany({
        where: {
            transactionDate: {
                gte: startDate,
                lte: endDate,
            },
        },
    })

    const income = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = income - expense

    // Calculate duration of current period to get comparison period
    const duration = endDate.getTime() - startDate.getTime()
    const prevStartDate = new Date(startDate.getTime() - duration - 1000)
    const prevEndDate = new Date(startDate.getTime() - 1000)

    const prevTransactions = await prisma.transaction.findMany({
        where: {
            transactionDate: {
                gte: prevStartDate,
                lte: prevEndDate,
            },
        },
    })

    const prevIncome = prevTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const prevExpense = prevTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const incomeChange = prevIncome === 0 ? 0 : ((income - prevIncome) / prevIncome) * 100
    const expenseChange = prevExpense === 0 ? 0 : ((expense - prevExpense) / prevExpense) * 100

    return {
        income,
        expense,
        balance,
        incomeChange,
        expenseChange,
    }
}

export async function getDailyChartData(startDate: Date, endDate: Date) {
    const transactions = await prisma.transaction.findMany({
        where: {
            transactionDate: {
                gte: startDate,
                lte: endDate,
            },
        },
    })

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return days.map((day) => {
        const dayStr = format(day, "d MMM", { locale: id })
        const dayTransactions = transactions.filter(
            (t) => format(t.transactionDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        )

        const income = dayTransactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + Number(t.amount), 0)

        const expense = dayTransactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + Number(t.amount), 0)

        return {
            date: dayStr,
            income,
            expense,
        }
    })
}

export async function getCategoryBreakdown(startDate: Date, endDate: Date, type: "INCOME" | "EXPENSE") {
    const transactions = await prisma.transaction.findMany({
        where: {
            type,
            transactionDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            category: true,
        },
    })

    const categoryMap = new Map<string, { name: string; value: number; color: string }>()

    transactions.forEach((t) => {
        const current = categoryMap.get(t.categoryId) || {
            name: t.category.name,
            value: 0,
            color: t.category.color,
        }
        current.value += Number(t.amount)
        categoryMap.set(t.categoryId, current)
    })

    return Array.from(categoryMap.values()).sort((a, b) => b.value - a.value)
}

export async function getRecentTransactions(limit = 5) {
    const transactions = await prisma.transaction.findMany({
        take: limit,
        orderBy: {
            transactionDate: "desc",
        },
        include: {
            category: true,
        },
    })
    return transactions
}

export async function getExportData(startDate: Date, endDate: Date) {
    const transactions = await prisma.transaction.findMany({
        where: {
            transactionDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            category: true,
            user: true,
        },
        orderBy: {
            transactionDate: "asc",
        },
    })

    return transactions.map(t => ({
        date: format(t.transactionDate, "yyyy-MM-dd"),
        formattedDate: format(t.transactionDate, "dd/MM/yyyy", { locale: id }),
        type: t.type,
        category: t.category.name,
        amount: Number(t.amount),
        description: t.description,
        user: t.user?.fullName || "System"
    }))
}
