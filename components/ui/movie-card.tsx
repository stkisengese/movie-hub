"use client"

import type * as React from "react"
import Image from "next/image"
import { Star, Bookmark, Play, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { getImageUrl, formatRating, getMediaTitle, getMediaYear, isMovie } from "@/lib/api"
import { Button } from "@/components/ui/button"
import type { MediaItem } from "@/types"

interface MovieCardProps {
    item: MediaItem
    onCardClick?: (item: MediaItem) => void
    onWatchlistToggle?: (item: MediaItem) => void
    isInWatchlist?: boolean
    showWatchlistButton?: boolean
    className?: string
    size?: "sm" | "md" | "lg"
}

export function MovieCard({
    item,
    onCardClick,
    onWatchlistToggle,
    isInWatchlist = false,
    showWatchlistButton = true,
    className,
    size = "md",
}: MovieCardProps) {
    const title = getMediaTitle(item)
    const year = getMediaYear(item)
    const rating = formatRating(item.vote_average)
    const posterUrl = getImageUrl(item.poster_path)
    const mediaType = isMovie(item) ? "Movie" : "TV Show"

    const sizeClasses = {
        sm: "w-32",
        md: "w-40",
        lg: "w-48",
    }

    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(item)
        } else {
            // Default navigation to detail page
            const path = item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`
            window.location.href = path
        }
    }

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onWatchlistToggle?.(item)
    }

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-lg transition-all duration-300 ease-in-out cursor-pointer",
                "hover:scale-105 hover:shadow-xl hover:shadow-black/25",
                "focus-within:scale-105 focus-within:shadow-xl focus-within:shadow-black/25",
                sizeClasses[size],
                className,
            )}
            onClick={handleCardClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleCardClick()
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${title}`}
        >
            {/* Poster Image */}
            <div className="relative aspect-poster bg-gray-200 dark:bg-gray-800">
                <Image
                    src={posterUrl || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={false}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        {/* Media Type Badge */}
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium bg-primary-600 px-2 py-1 rounded">{mediaType}</span>
                            {year && <span className="text-xs font-medium bg-gray-800/80 px-2 py-1 rounded">{year}</span>}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-sm line-clamp-2 mb-1">{title}</h3>

                        {/* Rating */}
                        {item.vote_average > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{rating}</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-3">
                            <Button size="sm" variant="secondary" className="h-7 px-2 text-xs">
                                <Play className="h-3 w-3 mr-1" />
                                Details
                            </Button>

                            {showWatchlistButton && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleWatchlistClick}
                                    className="h-7 w-7 p-0 text-white hover:text-primary-400"
                                    aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                                >
                                    <Bookmark className={cn("h-4 w-4", isInWatchlist && "fill-current")} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Info (always visible) */}
            <div className="p-3 bg-card">
                <h3 className="font-medium text-sm line-clamp-2 mb-1" title={title}>
                    {title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {year}
                    </span>
                    {showWatchlistButton && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleWatchlistClick}
                            className="h-6 w-6 p-0 hover:text-primary-600"
                            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                        >
                            <Bookmark className={cn("h-3 w-3", isInWatchlist && "fill-current text-primary-600")} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
