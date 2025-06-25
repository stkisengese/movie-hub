"use client"

import { useState, useEffect } from "react"
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

    // Get initial query from URL params
    const initialQuery = searchParams.get("q") || ""

    // Search hook
    const movieSearch = useMovieSearch(300) // 300ms debounce

    // Local state
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    // Initialize search from URL params
    useEffect(() => {
        if (initialQuery) {
            movieSearch.setQuery(initialQuery)
        }
    }, [initialQuery, movieSearch.setQuery])

    // Update URL when search changes
    useEffect(() => {
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
        router.replace(newUrl, { scroll: false })
    }, [movieSearch.query, movieSearch.filters, router])

    // Add to search history when search is performed
    useEffect(() => {
        if (movieSearch.hasSearched && movieSearch.query && movieSearch.results.length >= 0) {
            searchHistory.addToHistory(movieSearch.query, movieSearch.totalResults)
        }
    }, [movieSearch.hasSearched, movieSearch.query, movieSearch.totalResults, searchHistory.addToHistory])

    const handleItemClick = (item: any) => {
        const path = item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`
        router.push(path)
    }

    const handlePageChange = (page: number) => {
        movieSearch.searchMovies({ page })
    }

    const handleFilterChange = (newFilters: any) => {
        movieSearch.setFilters(newFilters)
    }

    const handleClearFilters = () => {
        movieSearch.setFilters({
            type: "all",
            year: "all",
            genre: "all",
            sortBy: "popularity",
            sortOrder: "desc",
        })
    }

    const hasActiveFilters =
        movieSearch.filters.type !== "all" || movieSearch.filters.year !== "all" || movieSearch.filters.genre !== "all"

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    <Search className="h-8 w-8 text-primary-600" />
                    Search Movies & TV Shows
                </h1>
                <p className="text-muted-foreground">
                    Discover your next favorite movie or TV show from our extensive collection
                </p>
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
                    onSearchClick={(query) => movieSearch.setQuery(query)}
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
