import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export enum UserRole {
    ADMIN = 'ADMIN',
    BENDAHARA = 'BENDAHARA',
    KETUA_DKM = 'KETUA_DKM',
    VIEWER = 'VIEWER'
}

// Helper function to check authorization
export function isAuthorized(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole)
}

// Role hierarchy for permission checking
export const ROLE_PERMISSIONS = {
    ADMIN: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_settings'],
    BENDAHARA: ['create', 'read', 'update', 'delete'],
    KETUA_DKM: ['read', 'update'],
    VIEWER: ['read'],
}

const authConfig = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // This will be overridden in auth.ts with actual logic
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string
                // Cast to ensure type compatibility
                token.role = user.role as unknown as UserRole
                token.permissions = (user as any).permissions
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as unknown as UserRole
                (session.user as any).permissions = token.permissions
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
} satisfies NextAuthConfig

export default authConfig
