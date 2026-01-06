import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import authConfig from "@/auth.config"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        // Re-inject Credentials Provider with full logic
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Partial<Record<"email" | "password", unknown>>) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email dan password harus diisi")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user) {
                    return null
                }

                if (!user.isActive) {
                    return null
                    // Note: We might want a way to say "Inactive", but for security/simplicity returning null (generic error) is safer standard behavior unless we handle custom errors differently.
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                )

                if (!isPasswordValid) {
                    return null
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                })

                // Log activity
                await prisma.auditLog.create({
                    data: {
                        userId: user.id,
                        action: "LOGIN",
                        entityType: "USER",
                        entityId: user.id,
                        newData: { email: user.email } as any
                    }
                })

                return {
                    id: user.id,
                    email: user.email,
                    name: user.fullName,
                    role: user.role, // Prisma role enum string matches ours
                    permissions: (user as any).permissions,
                }
            }
        })
    ],
})

// Re-export helpers from config for convenience
export { isAuthorized, ROLE_PERMISSIONS } from "@/auth.config"
