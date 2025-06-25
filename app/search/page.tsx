"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import { FilterSelect } from "@/components/ui/filter-select"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading"
import { PaginationComponent } from "@/components/ui/pagination"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { SearchHistory } from "@/components/search/search-history"
import { useMovieSearch, useWatchlist, useSearchHistory } from "@/hooks"

export default function SearchPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const watchlist = useWatchlist()
    const searchHistory = useSearchHistory()

    // Search hook
    const movieSearch = useMovieSearch(300) // 300ms debounce

    // Local state
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize search from URL params only once
    useEffect(() => {
        if (isInitialized) return

        const initialQuery = searchParams.get("q") || ""
        const type = searchParams.get("type")
        const sort = searchParams.get("sort")

        // Set initial state without triggering searches
        if (initialQuery) {
            movieSearch.setQuery(initialQuery)
        }

        // Set filters based on URL params
        if (type && (type === "movie" || type === "tv")) {
            movieSearch.setFilters({ type })
        }
        if (sort) {
            movieSearch.setFilters({ sortBy: sort })
        }

        setIsInitialized(true)
    }, []) // Remove all dependencies to run only once

    // Separate effect for URL updates (after initialization)
    useEffect(() => {
        if (!isInitialized) return

        const params = new URLSearchParams()
        if (movieSearch.query) {
            params.set("q", movieSearch.query)
        }
        if (movieSearch.filters.type !== "all") {
            params.set("type", movieSearch.filters.type)
        }
        if (movieSearch.filters.year !== "all") {
            params.set("year", movieSearch.filters.year)
        }
        if (movieSearch.filters.genre !== "all") {
            params.set("genre", movieSearch.filters.genre)
        }

        const newUrl = params.toString() ? `/search?${params.toString()}` : "/search"

        // Use a timeout to prevent rapid URL updates
        const timeoutId = setTimeout(() => {
            router.replace(newUrl, { scroll: false })
        }, 100)

        return () => clearTimeout(timeoutId)
    }, [
        movieSearch.query,
        movieSearch.filters.type,
        movieSearch.filters.year,
        movieSearch.filters.genre,
        router,
        isInitialized,
    ])

    // Add to search history when search is performed
    useEffect(() => {
        if (movieSearch.hasSearched && movieSearch.query && movieSearch.results.length >= 0) {
            searchHistory.addToHistory(movieSearch.query, movieSearch.totalResults)
        }
    }, [movieSearch.hasSearched, movieSearch.query, movieSearch.totalResults, searchHistory])

    const handleItemClick = useCallback(
        (item: any) => {
            const path = item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`
            router.push(path)
        },
        [router],
    )

    const handlePageChange = useCallback(
        (page: number) => {
            movieSearch.searchMovies({ page })
        },
        [movieSearch],
    )

    const handleFilterChange = useCallback(
        (newFilters: any) => {
            movieSearch.setFilters(newFilters)
        },
        [movieSearch],
    )

    const handleClearFilters = useCallback(() => {
        movieSearch.setFilters({
            type: "all",
            year: "all",
            genre: "all",
            sortBy: "popularity",
            sortOrder: "desc",
        })
    }, [movieSearch])

    const handleSearchHistoryClick = useCallback(
        (query: string) => {
            movieSearch.setQuery(query)
        },
        [movieSearch],
    )

    const hasActiveFilters =
        movieSearch.filters.type !== "all" || movieSearch.filters.year !== "all" || movieSearch.filters.genre !== "all"

    const getPageTitle = () => {
        const type = searchParams.get("type")
        const sort = searchParams.get("sort")

        if (type === "movie" && !movieSearch.query) {
            return "Discover Movies"
        }
        if (type === "tv" && !movieSearch.query) {
            return "Discover TV Shows"
        }
        if (sort === "popularity" && !movieSearch.query) {
            return "Trending Now"
        }
        if (sort === "vote_average" && !movieSearch.query) {
            return "Top Rated"
        }
        return "Search Movies & TV Shows"
    }

    const getPageDescription = () => {
        const type = searchParams.get("type")
        const sort = searchParams.get("sort")

        if (type === "movie" && !movieSearch.query) {
            return "Explore our extensive collection of movies from all genres and eras"
        }
        if (type === "tv" && !movieSearch.query) {
            return "Find your next binge-worthy TV series from our vast catalog"
        }
        if (sort === "popularity" && !movieSearch.query) {
            return "See what's trending in movies and TV shows right now"
        }
        if (sort === "vote_average" && !movieSearch.query) {
            return "Discover the highest-rated movies and TV shows"
        }
        return "Discover your next favorite movie or TV show from our extensive collection"
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    <Search className="h-8 w-8 text-primary-600" />
                    {getPageTitle()}
                </h1>
                <p className="text-muted-foreground">{getPageDescription()}</p>
            </div>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-8">
                <SearchInput
                    placeholder="Search for movies, TV shows, actors..."
                    value={movieSearch.query}
                    onSearch={movieSearch.setQuery}
                    onClear={movieSearch.clearSearch}
                    className="h-14 text-lg"
                />
            </div>

            {/* Search History (when no query) */}
            {!movieSearch.query && !movieSearch.hasSearched && (
                <SearchHistory
                    history={searchHistory.getRecentSearches(8)}
                    onSearchClick={handleSearchHistoryClick}
                    onClearHistory={searchHistory.clearHistory}
                    className="mb-8"
                />
            )}

            {/* Filters and Controls */}
            {(movieSearch.query || movieSearch.hasSearched) && (
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Quick Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <FilterSelect
                                value={movieSearch.filters.type}
                                onValueChange={(value) => handleFilterChange({ type: value })}
                                options={[
                                    { value: "all", label: "All Types" },
                                    { value: "movie", label: "Movies" },
                                    { value: "tv", label: "TV Shows" },
                                ]}
                                className="w-32"
                            />

                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                                        {
                                            Object.values(movieSearch.filters).filter(
                                                (v) => v !== "all" && v !== "popularity" && v !== "desc",
                                            ).length
                                        }
                                    </span>
                                )}
                            </Button>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>

                        {/* View Mode and Results Info */}
                        <div className="flex items-center gap-4">
                            {movieSearch.hasSearched && (
                                <span className="text-sm text-muted-foreground">
                                    {movieSearch.totalResults.toLocaleString()} results
                                    {movieSearch.query && ` for "${movieSearch.query}"`}
                                </span>
                            )}

                            <div className="flex items-center gap-1">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    Grid
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    List
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-4">
                            <SearchFilters
                                filters={movieSearch.filters}
                                onFiltersChange={handleFilterChange}
                                onClose={() => setShowFilters(false)}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {movieSearch.isLoading && <LoadingSpinner className="my-12" />}

            {/* Error State */}
            {movieSearch.error && (
                <div className="text-center py-12">
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Search Error</h3>
                        <p className="text-red-600 dark:text-red-300">{movieSearch.error}</p>
                        <Button onClick={() => movieSearch.searchMovies()} className="mt-4" variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            )}

            {/* No Results */}
            {movieSearch.hasSearched && !movieSearch.isLoading && movieSearch.results.length === 0 && !movieSearch.error && (
                <EmptyState
                    icon={<Search className="h-16 w-16" />}
                    title="No results found"
                    description={`We couldn't find any ${movieSearch.filters.type === "all" ? "movies or TV shows" : movieSearch.filters.type === "movie" ? "movies" : "TV shows"} matching "${movieSearch.query}".`}
                    action={{
                        label: "Clear Search",
                        onClick: movieSearch.clearSearch,
                    }}
                />
            )}

            {/* Search Results */}
            {movieSearch.results.length > 0 && !movieSearch.isLoading && (
                <>
                    <SearchResults
                        results={movieSearch.results}
                        viewMode={viewMode}
                        onItemClick={handleItemClick}
                        onWatchlistToggle={watchlist.toggleWatchlist}
                        isInWatchlist={watchlist.isInWatchlist}
                    />

                    {/* Pagination */}
                    {movieSearch.totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <PaginationComponent
                                currentPage={movieSearch.currentPage}
                                totalPages={Math.min(movieSearch.totalPages, 500)} // TMDB API limit
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}

                    {/* Load More Button (alternative to pagination) */}
                    {movieSearch.currentPage < movieSearch.totalPages && movieSearch.currentPage < 500 && (
                        <div className="mt-8 text-center">
                            <Button onClick={movieSearch.loadMore} disabled={movieSearch.isLoading} variant="outline" size="lg">
                                {movieSearch.isLoading ? "Loading..." : "Load More Results"}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
