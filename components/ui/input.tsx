import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                        {props.required && <span className="text-error ml-1">*</span>}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-base",
                        "placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
                        "transition-all duration-200",
                        error && "border-error focus:ring-error",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-error">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"

export { Input }
