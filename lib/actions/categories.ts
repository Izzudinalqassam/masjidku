"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function createCategory(values: z.infer<typeof categorySchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const validatedFields = categorySchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Data tidak valid" }
    }

    const { name, type, color, icon } = validatedFields.data

    try {
        const mosque = await prisma.mosque.findFirst()
        if (!mosque) return { error: "Mosque not found" }

        await prisma.category.create({
            data: {
                name,
                type,
                color,
                icon: icon || "wallet",
                mosqueId: mosque.id,
            },
        })

        revalidatePath("/categories")
        revalidatePath("/transactions/new")
        return { success: true }
    } catch (error) {
        console.error("Create category error:", error)
        return { error: "Gagal membuat kategori" }
    }
}

export async function updateCategory(id: string, values: z.infer<typeof categorySchema>) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const validatedFields = categorySchema.safeParse(values)
    if (!validatedFields.success) return { error: "Data tidak valid" }

    try {
        await prisma.category.update({
            where: { id },
            data: validatedFields.data,
        })
        revalidatePath("/categories")
        revalidatePath("/transactions/new")
        return { success: true }
    } catch (error) {
        return { error: "Gagal update kategori" }
    }
}

export async function deleteCategory(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Check if used in transactions
        const used = await prisma.transaction.count({ where: { categoryId: id } })
        if (used > 0) {
            return { error: "Kategori sedang digunakan dalam transaksi. Tidak bisa dihapus." }
        }

        await prisma.category.delete({ where: { id } })
        revalidatePath("/categories")
        revalidatePath("/transactions/new")
        return { success: true }
    } catch (error) {
        return { error: "Gagal menghapus kategori" }
    }
}
