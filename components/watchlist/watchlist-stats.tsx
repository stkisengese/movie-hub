"use client"

import { Film, Monitor, Eye, EyeOff, Star, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WatchlistStats } from "@/types"

interface WatchlistStatsProps {
    stats: WatchlistStats
    className?: string
}

export function WatchlistStats({ stats, className }: WatchlistStatsProps) {
    const statItems = [
        {
            label: "Total Items",
            value: stats.total,
            icon: <TrendingUp className="h-5 w-5" />,
            color: "text-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-950",
        },
        {
            label: "Movies",
            value: stats.movies,
            icon: <Film className="h-5 w-5" />,
            color: "text-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-950",
        },
        {
            label: "TV Shows",
            value: stats.tvShows,
            icon: <Monitor className="h-5 w-5" />,
            color: "text-green-500",
            bgColor: "bg-green-50 dark:bg-green-950",
        },
        {
            label: "Watched",
            value: stats.watched,
            icon: <Eye className="h-5 w-5" />,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50 dark:bg-emerald-950",
        },
        {
            label: "Unwatched",
            value: stats.unwatched,
            icon: <EyeOff className="h-5 w-5" />,
            color: "text-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-950",
        },
        {
            label: "Avg Rating",
            value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A",
            icon: <Star className="h-5 w-5" />,
            color: "text-yellow-500",
            bgColor: "bg-yellow-50 dark:bg-yellow-950",
        },
    ]

    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", className)}>
            {statItems.map((item) => (
                <div key={item.label} className={cn("p-4 rounded-lg border transition-colors hover:shadow-md", item.bgColor)}>
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-background", item.color)}>{item.icon}</div>
                        <div>
                            <p className="text-2xl font-bold">{item.value}</p>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
