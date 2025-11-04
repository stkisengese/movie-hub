"use client"

import { useState, useEffect, useCallback } from "react"
import { getMovieDetails, getTVShowDetails } from "@/lib/api"
import type { MovieDetails, TVShowDetails, OMDBMovie, APIResponse } from "@/types"

interface UseMovieDetailsReturn {
    details: MovieDetails | TVShowDetails | null
    omdbDetails: OMDBMovie | null
    isLoading: boolean
    error: string | null
    refresh: () => Promise<void>
}

export function useMovieDetails(id: number, type: "movie" | "tv"): UseMovieDetailsReturn {
    const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null)
    const [omdbDetails, setOmdbDetails] = useState<OMDBMovie | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDetails = useCallback(async () => {
        if (!id || !type) return

        setIsLoading(true)
        setError(null)

        try {
            // Fetch main details from TMDB
            const response: APIResponse<MovieDetails | TVShowDetails> =
                type === "movie" ? await getMovieDetails(id) : await getTVShowDetails(id)

            if (response.success && response.data) {
                setDetails(response.data)

                // Fetch additional details from OMDB if IMDB ID is available
                if (response.data.external_ids?.imdb_id) {
                    try {
                        const omdbResponse = await fetch(`/api/omdb/${response.data.external_ids.imdb_id}`)
                        if (omdbResponse.ok) {
                            const omdbData: OMDBMovie = await omdbResponse.json()
                            setOmdbDetails(omdbData)
                        }
                    } catch (omdbError) {
                        // OMDB error is not critical, just log it
                        console.warn("Failed to fetch OMDB details:", omdbError)
                    }
                }
            } else {
                setError(response.error?.message || "Failed to fetch details")
                setDetails(null)
                setOmdbDetails(null)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
            setDetails(null)
            setOmdbDetails(null)
        } finally {
            setIsLoading(false)
        }
    }, [id, type])

    // Fetch details when id or type changes
    useEffect(() => {
        fetchDetails()
    }, [fetchDetails])

    // Refresh function
    const refresh = useCallback(async () => {
        await fetchDetails()
    }, [fetchDetails])

    return {
        details,
        omdbDetails,
        isLoading,
        error,
        refresh,
    }
}
