"use client"

import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/ui/movie-card"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types"

interface TrendingSectionProps {
    title: string
    items: MediaItem[]
    isLoading?: boolean
    onItemClick?: (item: MediaItem) => void
    onWatchlistToggle?: (item: MediaItem) => void
    isInWatchlist?: (id: number, type: "movie" | "tv") => boolean
    className?: string
}

export function TrendingSection({
    title,
    items,
    isLoading = false,
    onItemClick,
    onWatchlistToggle,
    isInWatchlist,
    className,
}: TrendingSectionProps) {
    const [scrollPosition, setScrollPosition] = useState(0)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const handleItemClick = useCallback(
        (item: MediaItem) => {
            onItemClick?.(item)
        },
        [onItemClick],
    )

    const handleWatchlistToggle = useCallback(
        (item: MediaItem) => {
            onWatchlistToggle?.(item)
        },
        [onWatchlistToggle],
    )

    const handleScroll = (direction: "left" | "right") => {
        const container = document.getElementById(`trending-${title.replace(/\s+/g, "-").toLowerCase()}`)
        if (!container) return

        const scrollAmount = 320 // Width of card + gap
        const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount

        container.scrollTo({
            left: newPosition,
            behavior: "smooth",
        })

        setScrollPosition(newPosition)
        setCanScrollLeft(newPosition > 0)
        setCanScrollRight(newPosition < container.scrollWidth - container.clientWidth)
    }

    if (isLoading) {
        return (
            <section className={cn("py-8", className)}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="h-6 w-6 text-primary-600" />
                        <LoadingSkeleton className="h-8 w-48" />
                    </div>
                    <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0">
                                <LoadingSkeleton className="w-40 aspect-poster rounded-lg mb-3" />
                                <LoadingSkeleton className="h-4 w-32 mb-2" />
                                <LoadingSkeleton className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!items || items.length === 0) {
        return null
    }

    return (
        <section className={cn("py-8", className)}>
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-primary-600" />
                        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleScroll("left")}
                            disabled={!canScrollLeft}
                            className="h-10 w-10"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleScroll("right")}
                            disabled={!canScrollRight}
                            className="h-10 w-10"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="relative">
                    <div
                        id={`trending-${title.replace(/\s+/g, "-").toLowerCase()}`}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        onScroll={(e) => {
                            const container = e.currentTarget
                            setScrollPosition(container.scrollLeft)
                            setCanScrollLeft(container.scrollLeft > 0)
                            setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
                        }}
                    >
                        {items.map((item) => (
                            <div key={`${item.id}-${item.media_type}`} className="flex-shrink-0">
                                <MovieCard
                                    item={item}
                                    onCardClick={handleItemClick}
                                    onWatchlistToggle={handleWatchlistToggle}
                                    isInWatchlist={isInWatchlist?.(item.id, item.media_type as "movie" | "tv") || false}
                                    size="md"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Gradient Fade Effects */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    )
}
