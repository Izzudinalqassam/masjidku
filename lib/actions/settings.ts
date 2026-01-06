"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { settingsSchema } from "@/lib/validations/settings"
import { z } from "zod"


export async function getMosqueSettings() {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    // Find the first mosque or create default
    let mosque = await prisma.mosque.findFirst()

    if (!mosque) {
        mosque = await prisma.mosque.create({
            data: {
                name: "Masjid Al-Ikhlas", // Default name
                openingBalance: 0,
                openingDate: new Date(),
            }
        })
    }

    return {
        ...mosque,
        openingBalance: mosque.openingBalance.toNumber(),
    }
}

export async function updateMosqueSettings(values: z.infer<typeof settingsSchema>) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    const validatedFields = settingsSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Data tidak valid" }
    }

    try {
        // We assume single mosque for now
        const mosque = await prisma.mosque.findFirst()

        if (!mosque) {
            return { error: "Data masjid tidak ditemukan" }
        }

        await prisma.mosque.update({
            where: { id: mosque.id },
            data: {
                name: validatedFields.data.name,
                address: validatedFields.data.address,
                phone: validatedFields.data.phone,
                email: validatedFields.data.email,
                openingBalance: validatedFields.data.openingBalance,
                openingDate: validatedFields.data.openingDate,
            }
        })

        revalidatePath("/admin/dashboard") // Updates might affect dashboard name/stats
        return { success: true }
    } catch (error) {
        console.error("Update settings error:", error)
        return { error: "Gagal menyimpan pengaturan" }
    }
}

import bcrypt from "bcryptjs"

export async function resetDatabase(password: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    if (!password) return { error: "Password konfirmasi diperlukan" }

    try {
        // Verify password
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "Sesi tidak valid" }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
        if (!isPasswordValid) {
            return { error: "Password konfirmasi salah" }
        }

        // Perform Reset
        await prisma.transaction.deleteMany({})
        await prisma.mosque.updateMany({
            data: {
                openingBalance: 0,
            }
        })

        // Log the reset activity
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "DATA_RESET",
                entityType: "SYSTEM",
                entityId: "DATABASE",
                newData: {
                    description: "User melakukan pembersihan seluruh data transaksi",
                    timestamp: new Date().toISOString()
                } as any
            }
        })

        revalidatePath("/admin/dashboard")
        revalidatePath("/admin/transactions")
        revalidatePath("/admin/reports")
        return { success: true }
    } catch (error) {
        console.error("Reset DB error:", error)
        return { error: "Gagal mereset data" }
    }
}


