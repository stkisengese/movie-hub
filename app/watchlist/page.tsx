"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bookmark, Filter, SortAsc, SortDesc, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import { FilterSelect } from "@/components/ui/filter-select"
import { EmptyState } from "@/components/ui/empty-state"
import { MovieCard } from "@/components/ui/movie-card"
import { WatchlistItem } from "@/components/watchlist"
import { WatchlistStats } from "@/components/watchlist/watchlist-stats"
import { WatchlistFilters } from "@/components/watchlist/watchlist-filters"
import { BulkActions } from "@/components/watchlist/bulk-actions"
import { useWatchlist, useDebounce } from "@/hooks"
import { cn } from "@/lib/utils"
import type { WatchlistItem as WatchlistItemType } from "@/types"

type ViewMode = "grid" | "list"
type FilterType = "all" | "movies" | "tv" | "watched" | "unwatched"
type SortType = "added" | "title" | "year" | "rating"
type SortOrder = "asc" | "desc"

export default function WatchlistPage() {
    const router = useRouter()
    const watchlist = useWatchlist()

    // State
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<FilterType>("all")
    const [sortType, setSortType] = useState<SortType>("added")
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [showFilters, setShowFilters] = useState(false)

    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    // Filter and sort watchlist
    const filteredAndSortedItems = (() => {
        let items = watchlist.getFilteredWatchlist(filterType)

        // Apply search filter
        if (debouncedSearchQuery) {
            items = items.filter((item) => item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
        }

        // Sort items
        items.sort((a, b) => {
            let comparison = 0

            switch (sortType) {
                case "added":
                    comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
                    break
                case "title":
                    comparison = a.title.localeCompare(b.title)
                    break
                case "year":
                    comparison = new Date(a.release_date || "").getFullYear() - new Date(b.release_date || "").getFullYear()
                    break
                case "rating":
                    comparison = (a.rating || 0) - (b.rating || 0)
                    break
            }

            return sortOrder === "asc" ? comparison : -comparison
        })

        return items
    })()

    // Selection handlers
    const handleSelectItem = (itemId: string, selected: boolean) => {
        const newSelected = new Set(selectedItems)
        if (selected) {
            newSelected.add(itemId)
        } else {
            newSelected.delete(itemId)
        }
        setSelectedItems(newSelected)
    }

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedItems(new Set(filteredAndSortedItems.map((item) => `${item.id}-${item.type}`)))
        } else {
            setSelectedItems(new Set())
        }
    }

    const handleBulkAction = (action: string) => {
        const itemsToProcess = filteredAndSortedItems.filter((item) => selectedItems.has(`${item.id}-${item.type}`))

        switch (action) {
            case "remove":
                itemsToProcess.forEach((item) => {
                    watchlist.removeFromWatchlist(item.id, item.type)
                })
                break
            case "mark-watched":
                itemsToProcess.forEach((item) => {
                    if (!item.watched) {
                        watchlist.toggleWatched(item.id, item.type)
                    }
                })
                break
            case "mark-unwatched":
                itemsToProcess.forEach((item) => {
                    if (item.watched) {
                        watchlist.toggleWatched(item.id, item.type)
                    }
                })
                break
        }

        setSelectedItems(new Set())
    }

    const handleItemClick = (item: WatchlistItemType) => {
        const path = item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`
        router.push(path)
    }

    const filterOptions = [
        { value: "all", label: "All Items" },
        { value: "movies", label: "Movies" },
        { value: "tv", label: "TV Shows" },
        { value: "watched", label: "Watched" },
        { value: "unwatched", label: "Unwatched" },
    ]

    const sortOptions = [
        { value: "added", label: "Date Added" },
        { value: "title", label: "Title" },
        { value: "year", label: "Release Year" },
        { value: "rating", label: "Rating" },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        <Bookmark className="h-8 w-8 text-primary-600" />
                        My Watchlist
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage your saved movies and TV shows</p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                    <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
                        Grid
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                        List
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <WatchlistStats stats={watchlist.stats} className="mb-8" />

            {/* Search and Filters */}
            <div className="space-y-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <SearchInput
                            placeholder="Search your watchlist..."
                            value={searchQuery}
                            onSearch={setSearchQuery}
                            onClear={() => setSearchQuery("")}
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex gap-2">
                        <FilterSelect
                            value={filterType}
                            onValueChange={(value) => setFilterType(value as FilterType)}
                            options={filterOptions}
                            className="w-40"
                        />

                        <FilterSelect
                            value={sortType}
                            onValueChange={(value) => setSortType(value as SortType)}
                            options={sortOptions}
                            className="w-40"
                        />

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                        >
                            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        </Button>

                        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} title="Advanced Filters">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <WatchlistFilters
                        onFiltersChange={(filters) => {
                            // Apply advanced filters here
                            console.log("Advanced filters:", filters)
                        }}
                    />
                )}
            </div>

            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
                <BulkActions
                    selectedCount={selectedItems.size}
                    totalCount={filteredAndSortedItems.length}
                    onSelectAll={handleSelectAll}
                    onBulkAction={handleBulkAction}
                    className="mb-6"
                />
            )}

            {/* Content */}
            {filteredAndSortedItems.length === 0 ? (
                <EmptyState
                    icon={<Bookmark className="h-16 w-16" />}
                    title={watchlist.watchlist.length === 0 ? "Your watchlist is empty" : "No items match your filters"}
                    description={
                        watchlist.watchlist.length === 0
                            ? "Start adding movies and TV shows to keep track of what you want to watch."
                            : "Try adjusting your search or filter criteria."
                    }
                    action={
                        watchlist.watchlist.length === 0
                            ? {
                                label: "Browse Movies",
                                onClick: () => router.push("/"),
                            }
                            : {
                                label: "Clear Filters",
                                onClick: () => {
                                    setSearchQuery("")
                                    setFilterType("all")
                                },
                            }
                    }
                />
            ) : (
                <div
                    className={cn(
                        viewMode === "grid"
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                            : "space-y-4",
                    )}
                >
                    {filteredAndSortedItems.map((item) => {
                        const itemKey = `${item.id}-${item.type}`
                        const isSelected = selectedItems.has(itemKey)

                        return viewMode === "grid" ? (
                            <div key={itemKey} className="relative">
                                {/* Selection checkbox */}
                                <div className="absolute top-2 left-2 z-10">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => handleSelectItem(itemKey, e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </div>

                                <MovieCard
                                    item={{
                                        id: item.id,
                                        media_type: item.type,
                                        title: item.title,
                                        name: item.title,
                                        overview: "",
                                        poster_path: item.poster_path,
                                        backdrop_path: null,
                                        release_date: item.release_date,
                                        first_air_date: item.release_date,
                                        vote_average: item.vote_average,
                                        vote_count: 0,
                                        genre_ids: [],
                                        adult: false,
                                        popularity: 0,
                                        original_language: "en",
                                        ...(item.type === "tv" && { origin_country: [] }),
                                    }}
                                    onCardClick={() => handleItemClick(item)}
                                    onWatchlistToggle={() => watchlist.removeFromWatchlist(item.id, item.type)}
                                    isInWatchlist={true}
                                    size="sm"
                                    className={cn(isSelected && "ring-2 ring-primary-500")}
                                />

                                {/* Watched indicator */}
                                {item.watched && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                        <Eye className="h-3 w-3" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <WatchlistItem
                                key={itemKey}
                                item={item}
                                isSelected={isSelected}
                                onSelect={(selected) => handleSelectItem(itemKey, selected)}
                                onItemClick={() => handleItemClick(item)}
                                onToggleWatched={() => watchlist.toggleWatched(item.id, item.type)}
                                onRemove={() => watchlist.removeFromWatchlist(item.id, item.type)}
                                onUpdateRating={(rating) => watchlist.updateRating(item.id, item.type, rating)}
                                onUpdateNotes={(notes) => watchlist.updateNotes(item.id, item.type, notes)}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
