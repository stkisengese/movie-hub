"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, Info, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBackdropUrl, formatRating, getMediaTitle, getMediaYear } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types"

interface HeroSectionProps {
    featuredItems: MediaItem[]
    onPlayClick?: (item: MediaItem) => void
    onInfoClick?: (item: MediaItem) => void
    className?: string
}

export function HeroSection({ featuredItems, onPlayClick, onInfoClick, className }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const currentItem = featuredItems[currentIndex]

    // Auto-rotate featured items
    useEffect(() => {
        if (!isAutoPlaying || featuredItems.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
        }, 8000) // Change every 8 seconds

        return () => clearInterval(interval)
    }, [featuredItems.length, isAutoPlaying])

    if (!currentItem || featuredItems.length === 0) {
        return (
            <div className={cn("relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center", className)}>
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                        <div className="h-8 bg-gray-600 rounded mb-4 animate-pulse" />
                        <div className="h-4 bg-gray-600 rounded mb-2 animate-pulse" />
                        <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    const title = getMediaTitle(currentItem)
    const year = getMediaYear(currentItem)
    const rating = formatRating(currentItem.vote_average)
    const backdropUrl = getBackdropUrl(currentItem.backdrop_path, "original")

    return (
        <div className={cn("relative h-[70vh] overflow-hidden", className)}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backdropUrl || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                        {/* Media Type Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {currentItem.media_type === "movie" ? "Movie" : "TV Show"}
                            </span>
                            {year && (
                                <div className="flex items-center gap-1 text-sm text-gray-300">
                                    <Calendar className="h-4 w-4" />
                                    {year}
                                </div>
                            )}
                            {currentItem.vote_average > 0 && (
                                <div className="flex items-center gap-1 text-sm text-gray-300">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    {rating}
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{title}</h1>

                        {/* Overview */}
                        {currentItem.overview && (
                            <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3 leading-relaxed">
                                {currentItem.overview}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
                                onClick={() => onPlayClick?.(currentItem)}
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                Watch Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-black font-semibold px-8"
                                onClick={() => onInfoClick?.(currentItem)}
                            >
                                <Info className="mr-2 h-5 w-5" />
                                More Info
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Indicators */}
            {featuredItems.length > 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                        {featuredItems.map((_, index) => (
                            <button
                                key={index}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75",
                                )}
                                onClick={() => {
                                    setCurrentIndex(index)
                                    setIsAutoPlaying(false)
                                    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10s
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Pause/Play Auto-rotation Button */}
            {featuredItems.length > 1 && (
                <button
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    aria-label={isAutoPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
                >
                    {isAutoPlaying ? "⏸️" : "▶️"}
                </button>
            )}
        </div>
    )
}
