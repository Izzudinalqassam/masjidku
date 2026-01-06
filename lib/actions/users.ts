"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const userSchema = z.object({
    fullName: z.string().min(1, "Nama lengkap harus diisi"),
    email: z.string().email("Email tidak valid"),
    role: z.enum(["ADMIN", "BENDAHARA", "KETUA_DKM", "VIEWER"]),
    password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    permissions: z.any().optional(),
})

export async function getUsers() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    return await prisma.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function createUser(values: z.infer<typeof userSchema>) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    const validatedFields = userSchema.safeParse(values)
    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten())
        return { error: "Data tidak valid" }
    }

    const { fullName, email, role, password, permissions } = validatedFields.data

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) return { error: "Email sudah terdaftar" }

        const hashedPassword = await bcrypt.hash(password || "123456", 10)

        // Ensure permissions is a valid object
        const finalPermissions = permissions || {}

        await prisma.user.create({
            data: {
                fullName,
                email,
                role,
                passwordHash: hashedPassword,
                permissions: finalPermissions,
            } as any
        })

        revalidatePath("/users")
        return { success: true }
    } catch (error: any) {
        console.error("Create user error detailed:", error)
        return { error: `Gagal membuat user: ${error.message || "Unknown error"}` }
    }
}

export async function updateUser(id: string, values: z.infer<typeof userSchema>) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    const validatedFields = userSchema.safeParse(values)
    if (!validatedFields.success) return { error: "Data tidak valid" }

    try {
        const dataToUpdate: any = {
            fullName: validatedFields.data.fullName,
            email: validatedFields.data.email,
            role: validatedFields.data.role,
            permissions: validatedFields.data.permissions || {}
        }

        if (validatedFields.data.password) {
            dataToUpdate.passwordHash = await bcrypt.hash(validatedFields.data.password, 10)
        }

        await prisma.user.update({
            where: { id },
            data: dataToUpdate
        } as any)

        revalidatePath("/users")
        return { success: true }
    } catch (error) {
        console.error("Update user error:", error)
        return { error: "Gagal update user" }
    }
}

export async function deleteUser(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    if (session.user.id === id) {
        return { error: "Tidak dapat menghapus akun sendiri" }
    }

    try {
        await prisma.user.delete({ where: { id } })
        revalidatePath("/users")
        return { success: true }
    } catch (error) {
        return { error: "Gagal menghapus user" }
    }
}

export async function getActivityLogs() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    return await prisma.auditLog.findMany({
        where: {
            action: {
                in: ["LOGIN", "DATA_RESET"]
            }
        },
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true,
                    role: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 100 // Limit to last 100 logs
    })
}
