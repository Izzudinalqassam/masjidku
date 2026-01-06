"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ArrowDownUp,
    Tags,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Building2,
    UserCircle,
    CalendarDays
} from "lucide-react"

import { SheetClose } from "@/components/ui/sheet"
import { UserProfileDialog } from "@/components/user/user-profile-dialog"
import { UserPermissions } from "@/lib/permissions"

const navigation = [
    { id: "dashboard", name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { id: "transactions", name: "Input Transaksi", href: "/admin/transactions/new", icon: ArrowDownUp },
    { id: "categories", name: "Kategori", href: "/admin/categories", icon: Tags },
    { id: "events", name: "Kegiatan", href: "/admin/events", icon: CalendarDays, adminOnly: true },
    { id: "reports", name: "Laporan", href: "/admin/reports", icon: BarChart3 },
    { id: "users", name: "Pengguna", href: "/admin/users", icon: Users, adminOnly: true },
    { id: "settings", name: "Pengaturan", href: "/admin/settings", icon: Settings },
]

interface SidebarProps {
    userRole?: string
    userName?: string
    userEmail?: string
    permissions?: UserPermissions
    isMobile?: boolean
}

export function Sidebar({ userRole, userName, userEmail, permissions, isMobile }: SidebarProps) {
    const pathname = usePathname()

    const filteredNav = navigation.filter(item => {
        // Always show dashboard if it has view perm or if it's the default
        if (item.id === 'dashboard') return true;

        // If it's admin only, check role
        if (item.adminOnly && userRole !== "ADMIN") return false;

        // Check granular permissions
        if (permissions && permissions[item.id]) {
            const pagePerms = permissions[item.id];
            return !!pagePerms?.view;
        }

        // Default to true for existing/old users if permissions are missing
        return true;
    })

    const NavItems = () => (
        <>
            {filteredNav.map((item) => {
                const isActive = pathname === item.href
                const LinkContent = (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                            isActive
                                ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100/50"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:pl-4"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                        )} />
                        {item.name}

                        {isActive && (
                            <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        )}
                    </Link>
                )

                if (isMobile) {
                    return <SheetClose asChild key={item.id}>{LinkContent}</SheetClose>
                }
                return LinkContent
            })}
        </>
    )

    return (
        <div className="flex flex-col h-full bg-white text-gray-900 border-r border-gray-100">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-xl shadow-sm hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">FinMas</h1>
                    <p className="text-xs font-medium text-gray-500">Masjid Al-Ikhlas</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                <NavItems />
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/30">
                <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm mb-3 relative group">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200/50 shadow-inner">
                            {userName?.charAt(0).toUpperCase() || <UserCircle className="w-6 h-6 opacity-50" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={userName}>
                                {userName || "Pengguna"}
                            </p>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 truncate">
                                {userRole || "Viewer"}
                            </p>
                        </div>

                        <UserProfileDialog currentName={userName} currentEmail={userEmail}>
                            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-emerald-600 transition-colors cursor-pointer" title="Pengaturan Akun">
                                <Settings className="w-4 h-4" />
                            </button>
                        </UserProfileDialog>
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 hover:text-red-700 border border-red-100 transition-all duration-200 active:scale-95"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar Aplikasi
                </button>
            </div>
        </div>
    )
}
