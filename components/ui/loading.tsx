import { cn } from "@/lib/utils"

interface LoadingProps {
    className?: string
    size?: "sm" | "md" | "lg"
}

export function Loading({ className, size = "md" }: LoadingProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    }

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div
                className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary-600", sizeClasses[size])}
            />
        </div>
    )
}


export function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center justify-center py-12", className)}>
            <Loading size="lg" />
        </div>
    )
}
