import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers } from "@/lib/actions/users"
import { UserManagement } from "@/components/users/user-management"
import { ActivityLogs } from "@/components/users/activity-logs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users as UsersIcon, ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
        redirect("/admin/dashboard")
    }

    const users = await getUsers()

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Pengelolaan Akses
                    </h1>
                    <p className="text-lg text-gray-500 mt-2 max-w-2xl">
                        Kelola akun pengguna dan pantau aktivitas keamanan sistem secara terpusat.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="management" className="space-y-6">
                <TabsList className="bg-gray-100/50 p-1 border border-gray-200/50 rounded-xl inline-flex h-auto">
                    <TabsTrigger
                        value="management"
                        className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                    >
                        <UsersIcon className="w-4 h-4" />
                        Manajemen User
                    </TabsTrigger>
                    <TabsTrigger
                        value="logs"
                        className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Log Aktivitas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="management" className="space-y-6 focus-visible:outline-none">
                    <UserManagement users={users} currentUserId={session.user.id} />
                </TabsContent>

                <TabsContent value="logs" className="space-y-6 focus-visible:outline-none">
                    <ActivityLogs />
                </TabsContent>
            </Tabs>
        </div>
    )
}
