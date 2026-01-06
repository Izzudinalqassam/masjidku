"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const userProfileSchema = z.object({
    fullName: z.string().min(1, "Nama lengkap harus diisi"),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false
    }
    return true
}, {
    message: "Password saat ini diperlukan untuk mengubah password",
    path: ["currentPassword"],
}).refine((data) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false
    }
    return true
}, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
})

export async function updateUserProfile(values: z.infer<typeof userProfileSchema>) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Unauthorized" }

    const validatedFields = userProfileSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: validatedFields.error.errors[0].message }
    }

    const { fullName, currentPassword, newPassword } = validatedFields.data

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) return { error: "User tidak ditemukan" }

        const updateData: any = {
            fullName,
        }

        // Handle password update
        if (newPassword && currentPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
            if (!isPasswordValid) {
                return { error: "Password saat ini salah" }
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            updateData.passwordHash = hashedPassword
        }

        await prisma.user.update({
            where: { id: user.id },
            data: updateData
        })

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Update profile error:", error)
        return { error: "Gagal mengupdate profil" }
    }
}
