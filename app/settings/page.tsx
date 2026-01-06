import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getMosqueSettings } from "@/lib/actions/settings"
import { SettingsForm } from "@/components/settings/settings-form"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const mosque = await getMosqueSettings()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pengaturan Masjid</h1>
                <p className="text-muted-foreground mt-1">
                    Kelola identitas dan konfigurasi sistem keuangan masjid.
                </p>
            </div>

            <SettingsForm mosque={mosque} />
        </div>
    )
}
