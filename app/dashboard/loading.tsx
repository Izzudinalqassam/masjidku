import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardLoading() {
    return (
        <div className="h-full flex items-center justify-center bg-gray-50/50">
            <LoadingSpinner size="lg" text="Menyiapkan halaman..." />
        </div>
    )
}
