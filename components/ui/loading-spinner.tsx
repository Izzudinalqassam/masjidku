import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl"
    text?: string
}

export function LoadingSpinner({
    className,
    size = "md",
    text = "Memuat data...",
    ...props
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16"
    }

    return (
        <div
            className={cn("flex flex-col items-center justify-center p-4 min-h-[200px] w-full", className)}
            {...props}
        >
            <Loader2 className={cn("animate-spin text-emerald-600 mb-4", sizeClasses[size])} />
            {text && (
                <p className="text-muted-foreground text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    )
}
