"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { MediaItem, MovieDetails, TVShowDetails, TMDBResponse } from "@/types"

interface UseAPIClientReturn {
    isLoading: boolean
    error: string | null
    getTrending: (
        mediaType?: "all" | "movie" | "tv",
        timeWindow?: "day" | "week",
    ) => Promise<TMDBResponse<MediaItem> | null>
    search: (params: any) => Promise<TMDBResponse<MediaItem> | null>
    getMovieDetails: (id: number) => Promise<MovieDetails | null>
    getTVShowDetails: (id: number) => Promise<TVShowDetails | null>
    discover: (params: any) => Promise<TMDBResponse<MediaItem> | null>
    getGenres: (mediaType?: "movie" | "tv") => Promise<{ genres: any[] } | null>
    healthCheck: () => Promise<any>
}

export function useAPIClient(): UseAPIClientReturn {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleRequest = useCallback(async (request: () => Promise<any>): Promise<any | null> => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await request()
            return result
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
            setError(errorMessage)
            console.error("API Client error:", err)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getTrending = useCallback(
        (mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week") =>
            handleRequest(() => apiClient.getTrending(mediaType, timeWindow)),
        [handleRequest],
    )

    const search = useCallback((params: any) => handleRequest(() => apiClient.search(params)), [handleRequest])

    const getMovieDetails = useCallback(
        (id: number) => handleRequest(() => apiClient.getMovieDetails(id)),
        [handleRequest],
    )

    const getTVShowDetails = useCallback(
        (id: number) => handleRequest(() => apiClient.getTVShowDetails(id)),
        [handleRequest],
    )

    const discover = useCallback((params: any) => handleRequest(() => apiClient.discover(params)), [handleRequest])

    const getGenres = useCallback(
        (mediaType: "movie" | "tv" = "movie") => handleRequest(() => apiClient.getGenres(mediaType)),
        [handleRequest],
    )

    const healthCheck = useCallback(() => handleRequest(() => apiClient.healthCheck()), [handleRequest])

    return {
        isLoading,
        error,
        getTrending,
        search,
        getMovieDetails,
        getTVShowDetails,
        discover,
        getGenres,
        healthCheck,
    }
}
