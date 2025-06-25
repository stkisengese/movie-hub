"use client"

import { MovieCard } from "@/components/ui/movie-card"
import { SearchResultItem } from "./search-result-item"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types"

interface SearchResultsProps {
    results: MediaItem[]
    viewMode: "grid" | "list"
    onItemClick: (item: MediaItem) => void
    onWatchlistToggle: (item: MediaItem) => void
    isInWatchlist: (id: number, type: "movie" | "tv") => boolean
    className?: string
}

export function SearchResults({
    results,
    viewMode,
    onItemClick,
    onWatchlistToggle,
    isInWatchlist,
    className,
}: SearchResultsProps) {
    if (viewMode === "grid") {
        return (
            <div
                className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4", className)}
            >
                {results.map((item) => (
                    <MovieCard
                        key={`${item.id}-${item.media_type}`}
                        item={item}
                        onCardClick={onItemClick}
                        onWatchlistToggle={onWatchlistToggle}
                        isInWatchlist={isInWatchlist(item.id, item.media_type as "movie" | "tv")}
                        size="sm"
                    />
                ))}
            </div>
        )
    }

    return (
        <div className={cn("space-y-4", className)}>
            {results.map((item) => (
                <SearchResultItem
                    key={`${item.id}-${item.media_type}`}
                    item={item}
                    onItemClick={onItemClick}
                    onWatchlistToggle={onWatchlistToggle}
                    isInWatchlist={isInWatchlist(item.id, item.media_type as "movie" | "tv")}
                />
            ))}
        </div>
    )
}
