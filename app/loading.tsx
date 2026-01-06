import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function GlobalLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <LoadingSpinner size="lg" />
        </div>
    )
}
