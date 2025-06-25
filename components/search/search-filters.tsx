"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Star, Film, Monitor, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterSelect } from "@/components/ui/filter-select"
import { cn } from "@/lib/utils"
import { getGenres } from "@/lib/api"
import type { SearchFilters as SearchFiltersType, Genre } from "@/types"

interface SearchFiltersProps {
    filters: SearchFiltersType
    onFiltersChange: (filters: Partial<SearchFiltersType>) => void
    onClose: () => void
    className?: string
}

export function SearchFilters({ filters, onFiltersChange, onClose, className }: SearchFiltersProps) {
    const [movieGenres, setMovieGenres] = useState<Genre[]>([])
    const [tvGenres, setTVGenres] = useState<Genre[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch genres on mount
    useEffect(() => {
        const fetchGenres = async () => {
            setIsLoading(true)
            try {
                const [movieResponse, tvResponse] = await Promise.all([getGenres("movie"), getGenres("tv")])

                if (movieResponse.success && movieResponse.data) {
                    setMovieGenres(movieResponse.data.genres)
                }
                if (tvResponse.success && tvResponse.data) {
                    setTVGenres(tvResponse.data.genres)
                }
            } catch (error) {
                console.error("Failed to fetch genres:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchGenres()
    }, [])

    // Get current genres based on selected type
    const currentGenres =
        filters.type === "movie" ? movieGenres : filters.type === "tv" ? tvGenres : [...movieGenres, ...tvGenres]
    const uniqueGenres = currentGenres.filter((genre, index, self) => index === self.findIndex((g) => g.id === genre.id))

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

    const yearOptions = [
        { value: "all", label: "All Years" },
        ...years.slice(0, 50).map((year) => ({ value: year.toString(), label: year.toString() })),
    ]

    const genreOptions = [
        { value: "all", label: "All Genres" },
        ...uniqueGenres.map((genre) => ({ value: genre.id.toString(), label: genre.name })),
    ]

    const sortOptions = [
        { value: "popularity", label: "Popularity" },
        { value: "vote_average", label: "Rating" },
        { value: "release_date", label: "Release Date" },
        { value: "title", label: "Title" },
    ]

    const handleReset = () => {
        onFiltersChange({
            type: "all",
            year: "all",
            genre: "all",
            sortBy: "popularity",
            sortOrder: "desc",
        })
    }

    return (
        <div className={cn("bg-muted/50 rounded-lg border p-6", className)}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-semibold">Advanced Filters</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Content Type */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        Content Type
                    </label>
                    <FilterSelect
                        value={filters.type}
                        onValueChange={(value) => onFiltersChange({ type: value as any })}
                        options={[
                            { value: "all", label: "All Types" },
                            { value: "movie", label: "Movies" },
                            { value: "tv", label: "TV Shows" },
                        ]}
                    />
                </div>

                {/* Release Year */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Release Year
                    </label>
                    <FilterSelect
                        value={filters.year}
                        onValueChange={(value) => onFiltersChange({ year: value })}
                        options={yearOptions}
                    />
                </div>

                {/* Genre */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Genre
                    </label>
                    <FilterSelect
                        value={filters.genre}
                        onValueChange={(value) => onFiltersChange({ genre: value })}
                        options={genreOptions}
                        placeholder={isLoading ? "Loading genres..." : "Select genre..."}
                    />
                </div>

                {/* Sort By */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Sort By
                    </label>
                    <div className="flex gap-2">
                        <FilterSelect
                            value={filters.sortBy}
                            onValueChange={(value) => onFiltersChange({ sortBy: value as any })}
                            options={sortOptions}
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                onFiltersChange({
                                    sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
                                })
                            }
                            title={`Sort ${filters.sortOrder === "asc" ? "Descending" : "Ascending"}`}
                        >
                            {filters.sortOrder === "asc" ? "↑" : "↓"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <Button variant="outline" onClick={handleReset}>
                    Reset All Filters
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>Apply Filters</Button>
                </div>
            </div>
        </div>
    )
}
