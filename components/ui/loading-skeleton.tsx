import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
    className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
    return <div className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)} />
}

export function MovieCardSkeleton({ className }: LoadingSkeletonProps) {
    return (
        <div className={cn("w-40", className)}>
            <LoadingSkeleton className="aspect-poster rounded-lg mb-3" />
            <LoadingSkeleton className="h-4 w-3/4 mb-2" />
            <LoadingSkeleton className="h-3 w-1/2" />
        </div>
    )
}

export function MovieGridSkeleton({ count = 10, className }: { count?: number; className?: string }) {
    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function DetailsSkeleton({ className }: LoadingSkeletonProps) {
    return (
        <div className={cn("flex flex-col md:flex-row gap-6", className)}>
            <div className="w-full md:w-1/3">
                <LoadingSkeleton className="aspect-poster rounded-lg" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
                <LoadingSkeleton className="h-8 w-3/4" />
                <div className="flex gap-4">
                    <LoadingSkeleton className="h-6 w-16" />
                    <LoadingSkeleton className="h-6 w-16" />
                    <LoadingSkeleton className="h-6 w-16" />
                </div>
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-5/6" />
                <LoadingSkeleton className="h-4 w-2/3" />
                <LoadingSkeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}
