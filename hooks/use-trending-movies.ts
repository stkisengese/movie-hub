"use client"

import { useState, useEffect, useCallback } from "react"
import { getTrending } from "@/lib/api"
import type { MediaItem, TrendingParams, TMDBResponse, APIResponse } from "@/types"

interface UseTrendingMoviesReturn {
    movies: MediaItem[]
    isLoading: boolean
    error: string | null
    refresh: () => Promise<void>
    timeWindow: "day" | "week"
    setTimeWindow: (timeWindow: "day" | "week") => void
    mediaType: "all" | "movie" | "tv"
    setMediaType: (mediaType: "all" | "movie" | "tv") => void
}

export function useTrendingMovies(): UseTrendingMoviesReturn {
    const [movies, setMovies] = useState<MediaItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeWindow, setTimeWindow] = useState<"day" | "week">("week")
    const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all")

    const fetchTrending = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const params: TrendingParams = {
                mediaType,
                timeWindow,
            }

            const response: APIResponse<TMDBResponse<MediaItem>> = await getTrending(params)

            if (response.success && response.data) {
                // Filter out adult content and items without posters
                const filteredResults = response.data.results.filter(
                    (item) => !item.adult && item.poster_path && item.media_type !== "person",
                )
                setMovies(filteredResults)
            } else {
                setError(response.error?.message || "Failed to fetch trending movies")
                setMovies([])
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
            setMovies([])
        } finally {
            setIsLoading(false)
        }
    }, [mediaType, timeWindow])

    // Fetch trending movies on mount and when parameters change
    useEffect(() => {
        fetchTrending()
    }, [fetchTrending])

    // Refresh function
    const refresh = useCallback(async () => {
        await fetchTrending()
    }, [fetchTrending])

    return {
        movies,
        isLoading,
        error,
        refresh,
        timeWindow,
        setTimeWindow,
        mediaType,
        setMediaType,
    }
}
