import { UserRole } from "@prisma/client"
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserPermissions } from "@/lib/permissions"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: UserRole
            permissions?: UserPermissions
        } & DefaultSession["user"]
    }

    interface User {
        role: UserRole
        permissions?: UserPermissions
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: UserRole
        permissions?: UserPermissions
    }
}
