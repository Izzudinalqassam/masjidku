import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/sidebar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // Fetch fresh user data if logged in
    let userData: any = session?.user
    if (session?.user?.email) {
        const dbUser: any = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
        if (dbUser) {
            userData = {
                ...userData,
                name: dbUser.fullName,
                role: dbUser.role,
                permissions: dbUser.permissions || undefined
            }
        }
    }

    const sidebarProps = {
        userRole: userData?.role,
        userName: userData?.name || "Pengguna",
        userEmail: userData?.email || "",
        permissions: (userData as any)?.permissions
    }

    return (
        <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-lg shadow-sm">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900 leading-tight">FinMas</h1>
                        <p className="text-[10px] font-medium text-gray-500">Masjid Al-Ikhlas</p>
                    </div>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 border-none">
                        <SheetTitle className="sr-only">Navigasi Sidebar</SheetTitle>
                        <Sidebar {...sidebarProps} isMobile />
                    </SheetContent>
                </Sheet>
            </header>

            {/* Desktop Sidebar - Fixed */}
            <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-100">
                <Sidebar {...sidebarProps} />
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
