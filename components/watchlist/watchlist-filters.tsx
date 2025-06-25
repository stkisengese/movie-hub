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
            
        </div>
    )
}
