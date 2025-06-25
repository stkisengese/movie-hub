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

            
        </div>
    )
}
