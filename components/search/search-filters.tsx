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
            
        </div>
    )
}
