"use client"

import { useState, useCallback, useEffect } from "react"
import { useDebounce } from "./use-debounce"
import { searchMulti } from "@/lib/api"
import type { MediaItem, SearchParams, SearchFilters, TMDBResponse, APIResponse } from "@/types"

interface UseMovieSearchReturn {
    query: string
    setQuery: (query: string) => void
    results: MediaItem[]
    isLoading: boolean
    error: string | null
    currentPage: number
    totalPages: number
    totalResults: number
    filters: SearchFilters
    setFilters: (filters: Partial<SearchFilters>) => void
    searchMovies: (params?: Partial<SearchParams>) => Promise<void>
    loadMore: () => Promise<void>
    clearSearch: () => void
    hasSearched: boolean
}

export function useMovieSearch(debounceMs = 500): UseMovieSearchReturn {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<MediaItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalResults, setTotalResults] = useState(0)
    const [hasSearched, setHasSearched] = useState(false)
    const [filters, setFiltersState] = useState<SearchFilters>({
        type: "all",
        year: "all",
        genre: "all",
        sortBy: "popularity",
        sortOrder: "desc",
    })

    const debouncedQuery = useDebounce(query, debounceMs)

    // Update filters
    const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }))
        setCurrentPage(1) // Reset to first page when filters change
    }, [])

    // Perform search
    const searchMovies = useCallback(
        async (params?: Partial<SearchParams>) => {
            const searchQuery = params?.query ?? debouncedQuery

            if (!searchQuery.trim()) {
                setResults([])
                setHasSearched(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const searchParams: SearchParams = {
                    query: searchQuery,
                    page: params?.page ?? currentPage,
                    filters: params?.filters ?? filters,
                }

                const response: APIResponse<TMDBResponse<MediaItem>> = await searchMulti(searchParams)

                if (response.success && response.data) {
                    const { results: newResults, page, total_pages, total_results } = response.data

                    // Filter results based on type if specified
                    let filteredResults = newResults
                    if (filters.type !== "all") {
                        filteredResults = newResults.filter((item) => item.media_type === filters.type)
                    }

                    // If loading more (page > 1), append to existing results
                    if (page > 1) {
                        setResults((prev) => [...prev, ...filteredResults])
                    } else {
                        setResults(filteredResults)
                    }

                    setCurrentPage(page)
                    setTotalPages(total_pages)
                    setTotalResults(total_results)
                    setHasSearched(true)
                } else {
                    setError(response.error?.message || "Search failed")
                    setResults([])
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred")
                setResults([])
            } finally {
                setIsLoading(false)
            }
        },
        [debouncedQuery, currentPage, filters],
    )

    // Load more results (pagination)
    const loadMore = useCallback(async () => {
        if (currentPage < totalPages && !isLoading) {
            await searchMovies({ page: currentPage + 1 })
        }
    }, [currentPage, totalPages, isLoading, searchMovies])

    // Clear search
    const clearSearch = useCallback(() => {
        setQuery("")
        setResults([])
        setError(null)
        setCurrentPage(1)
        setTotalPages(0)
        setTotalResults(0)
        setHasSearched(false)
    }, [])

    // Auto-search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim()) {
            setCurrentPage(1)
            searchMovies({ page: 1 })
        } else {
            setResults([])
            setHasSearched(false)
        }
    }, [debouncedQuery, filters]) // Include filters to re-search when they change

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalResults,
        filters,
        setFilters,
        searchMovies,
        loadMore,
        clearSearch,
        hasSearched,
    }
}
