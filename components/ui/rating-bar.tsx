import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

interface RatingBarProps {
    rating: number
    maxRating?: number
    source?: string
    showValue?: boolean
    className?: string
    size?: "sm" | "md" | "lg"
}

export function RatingBar({
    rating,
    maxRating = 10,
    source,
    showValue = true,
    className,
    size = "md",
}: RatingBarProps) {
    const percentage = Math.min(Math.max((rating / maxRating) * 100, 0), 100)

    const sizeClasses = {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-3",
    }

    const getRatingColor = (rating: number, maxRating: number) => {
        const normalizedRating = (rating / maxRating) * 10
        if (normalizedRating >= 8) return "bg-green-500"
        if (normalizedRating >= 6) return "bg-yellow-500"
        if (normalizedRating >= 4) return "bg-orange-500"
        return "bg-red-500"
    }

    return (
        <div className={cn("space-y-2", className)}>
            {source && (
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{source}</span>
                    {showValue && (
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                                {rating.toFixed(1)}
                                {maxRating !== 10 && `/${maxRating}`}
                            </span>
                        </div>
                    )}
                </div>
            )}
            <div className={cn("w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", sizeClasses[size])}>
                <div
                    className={cn("h-full rounded-full transition-all duration-500 ease-out", getRatingColor(rating, maxRating))}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

interface MultipleRatingsProps {
    ratings: Array<{
        source: string
        value: number
        maxValue?: number
    }>
    className?: string
}

export function MultipleRatings({ ratings, className }: MultipleRatingsProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {ratings.map((rating, index) => (
                <RatingBar
                    key={index}
                    rating={rating.value}
                    maxRating={rating.maxValue || 10}
                    source={rating.source}
                    showValue
                />
            ))}
        </div>
    )
}
