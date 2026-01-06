import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/sidebar"

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    let userData = session?.user
    if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
        if (dbUser) {
            userData = { ...userData, name: dbUser.fullName, role: dbUser.role }
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
                <Sidebar
                    userRole={userData?.role}
                    userName={userData?.name || "Pengguna"}
                    userEmail={userData?.email || ""}
                />
            </div>

            {/* Main Content */}
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
