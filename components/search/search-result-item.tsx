"use client"

import type React from "react"

import Image from "next/image"
import { Star, Calendar, Bookmark, Play, Film, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImageUrl, formatRating, getMediaTitle, getMediaYear } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types"

interface SearchResultItemProps {
    item: MediaItem
    onItemClick: (item: MediaItem) => void
    onWatchlistToggle: (item: MediaItem) => void
    isInWatchlist: boolean
    className?: string
}

export function SearchResultItem({
    item,
    onItemClick,
    onWatchlistToggle,
    isInWatchlist,
    className,
}: SearchResultItemProps) {
    const title = getMediaTitle(item)
    const year = getMediaYear(item)
    const rating = formatRating(item.vote_average)
    const posterUrl = getImageUrl(item.poster_path, "w185")
    const mediaType = item.media_type === "movie" ? "Movie" : "TV Show"
    const MediaIcon = item.media_type === "movie" ? Film : Monitor

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onWatchlistToggle(item)
    }

    return (
        <div
            className={cn(
                "flex gap-4 p-4 bg-card rounded-lg border transition-all hover:shadow-md cursor-pointer group",
                className,
            )}
            onClick={() => onItemClick(item)}
        >
            {/* Poster */}
            <div className="flex-shrink-0">
                <div className="w-20 h-30 rounded overflow-hidden bg-muted">
                    <Image
                        src={posterUrl || "/placeholder.svg"}
                        alt={title}
                        width={80}
                        height={120}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Title and Type */}
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary-600 transition-colors">
                                {title}
                            </h3>
                            <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs font-medium">
                                <MediaIcon className="h-3 w-3" />
                                {mediaType}
                            </span>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            {year && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {year}
                                </div>
                            )}
                            {item.vote_average > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {rating}
                                </div>
                            )}
                            {item.vote_count > 0 && <span>{item.vote_count.toLocaleString()} votes</span>}
                        </div>

                        {/* Overview */}
                        {item.overview && (
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{item.overview}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => onItemClick(item)} className="flex items-center gap-2">
                            <Play className="h-3 w-3" />
                            View Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleWatchlistClick} className="flex items-center gap-2">
                            <Bookmark className={cn("h-3 w-3", isInWatchlist && "fill-current")} />
                            {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
