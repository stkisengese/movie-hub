"use client"

import { useState } from "react"
import { Calendar, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterSelect } from "@/components/ui/filter-select"
import { cn } from "@/lib/utils"

interface WatchlistFiltersProps {
    onFiltersChange: (filters: WatchlistFilterOptions) => void
    className?: string
}

interface WatchlistFilterOptions {
    yearRange: { start: number; end: number }
    ratingRange: { min: number; max: number }
    genres: string[]
    sortBy: string
    sortOrder: "asc" | "desc"
}

export function WatchlistFilters({ onFiltersChange, className }: WatchlistFiltersProps) {
    const [filters, setFilters] = useState<WatchlistFilterOptions>({
        yearRange: { start: 1900, end: new Date().getFullYear() },
        ratingRange: { min: 0, max: 10 },
        genres: [],
        sortBy: "added",
        sortOrder: "desc",
    })

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

    const yearOptions = [
        { value: "all", label: "All Years" },
        ...years.slice(0, 20).map((year) => ({ value: year.toString(), label: year.toString() })),
    ]

    const ratingOptions = [
        { value: "all", label: "All Ratings" },
        { value: "9+", label: "9.0+ Excellent" },
        { value: "8+", label: "8.0+ Very Good" },
        { value: "7+", label: "7.0+ Good" },
        { value: "6+", label: "6.0+ Decent" },
        { value: "5+", label: "5.0+ Average" },
    ]

    const handleReset = () => {
        const defaultFilters: WatchlistFilterOptions = {
            yearRange: { start: 1900, end: currentYear },
            ratingRange: { min: 0, max: 10 },
            genres: [],
            sortBy: "added",
            sortOrder: "desc",
        }
        setFilters(defaultFilters)
        onFiltersChange(defaultFilters)
    }

    return (
        <div className={cn("bg-muted/50 rounded-lg p-4 space-y-4", className)}>
            <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4" />
                <h3 className="font-semibold">Advanced Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Year Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Release Year
                    </label>
                    <FilterSelect
                        value="all"
                        onValueChange={(value) => {
                            // Handle year filter change
                            console.log("Year filter:", value)
                        }}
                        options={yearOptions}
                        placeholder="Select year..."
                    />
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Minimum Rating
                    </label>
                    <FilterSelect
                        value="all"
                        onValueChange={(value) => {
                            // Handle rating filter change
                            console.log("Rating filter:", value)
                        }}
                        options={ratingOptions}
                        placeholder="Select rating..."
                    />
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <label className="text-sm font-medium opacity-0">Actions</label>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
                            Reset
                        </Button>
                        <Button size="sm" onClick={() => onFiltersChange(filters)} className="flex-1">
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
