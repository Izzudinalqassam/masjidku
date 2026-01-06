import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/sidebar"

export default async function TransactionsLayout({
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
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0 overflow-y-auto">
                <Sidebar
                    userRole={userData?.role}
                    userName={userData?.name || "Pengguna"}
                    userEmail={userData?.email || ""}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto">
                <div className="fade-in">
                    {children}
                </div>
            </main>
        </div>
    )
}
