'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { transactionSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export async function createTransaction(values: z.infer<typeof transactionSchema>) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Anda harus login untuk membuat transaksi" }
    }

    const validatedFields = transactionSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Data tidak valid" }
    }

    const { type, amount, categoryId, description, transactionDate } = validatedFields.data

    try {
        // Get Mosque ID (Single tenant solution for now)
        const mosque = await prisma.mosque.findFirst()
        if (!mosque) {
            return { error: "Data masjid tidak ditemukan. Hubungi administrator." }
        }

        await prisma.transaction.create({
            data: {
                type,
                amount,
                description,
                transactionDate: new Date(transactionDate),
                categoryId,
                mosqueId: mosque.id,
                createdBy: session.user.id,
            },
        })

        revalidatePath("/admin/dashboard")
        revalidatePath("/admin/transactions")

        return { success: true }
    } catch (error) {
        console.error("Transaction create error:", error)
        return { error: "Gagal membuat transaksi" }
    }
}

export async function getRecentTransactionsByType(
    type: "INCOME" | "EXPENSE",
    limit = 10,
    page = 1,
    startDate?: Date,
    endDate?: Date
) {
    const mosque = await prisma.mosque.findFirst()
    if (!mosque) return { data: [], totalPages: 0, totalCount: 0 }

    const where: any = {
        mosqueId: mosque.id,
        type: type,
    }

    if (startDate && endDate) {
        where.transactionDate = {
            gte: startDate,
            lte: endDate,
        }
    }

    const [transactions, totalCount] = await Promise.all([
        prisma.transaction.findMany({
            where,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                transactionDate: "desc",
            },
            include: {
                category: true,
                user: true,
            },
        }),
        prisma.transaction.count({ where })
    ])

    // Convert Decimal to number to avoid serialization issues
    return {
        data: transactions.map(t => ({
            ...t,
            amount: Number(t.amount)
        })),
        totalPages: Math.ceil(totalCount / limit),
        totalCount
    }
}

export async function getCategories() {
    const mosque = await prisma.mosque.findFirst()
    if (!mosque) return []

    return await prisma.category.findMany({
        where: { mosqueId: mosque.id, isActive: true },
        orderBy: { name: 'asc' },
    })
}
