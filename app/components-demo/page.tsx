"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { MovieCard } from "@/components/ui/movie-card"
import { SearchInput } from "@/components/ui/search-input"
import { RatingBar, MultipleRatings } from "@/components/ui/rating-bar"
import { FilterSelect } from "@/components/ui/filter-select"
import { EmptyState } from "@/components/ui/empty-state"
import { Pagination } from "@/components/ui/pagination"
import { MovieGridSkeleton, DetailsSkeleton } from "@/components/ui/loading-skeleton"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/modal"
import type { MediaItem } from "@/types"

// Sample data for demonstration
const sampleMovie: MediaItem = {
    id: 1,
    media_type: "movie",
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime...",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    release_date: "2008-07-18",
    vote_average: 9.0,
    vote_count: 32000,
    genre_ids: [28, 80, 18],
    adult: false,
    popularity: 123.456,
    original_language: "en",
}

export default function ComponentsDemo() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterValue, setFilterValue] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [isInWatchlist, setIsInWatchlist] = useState(false)

    const filterOptions = [
        { value: "all", label: "All" },
        { value: "movie", label: "Movies" },
        { value: "tv", label: "TV Shows" },
    ]

    const ratings = [
        { source: "TMDB", value: 9.0, maxValue: 10 },
        { source: "IMDB", value: 9.0, maxValue: 10 },
        { source: "Rotten Tomatoes", value: 94, maxValue: 100 },
    ]

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">UI Components Demo</h1>
                <p className="text-muted-foreground">Showcase of MovieFlix UI components</p>
            </div>

            {/* Movie Card */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Movie Card</h2>
                <div className="flex gap-4 flex-wrap">
                    <MovieCard
                        item={sampleMovie}
                        onCardClick={(item) => console.log("Card clicked:", item)}
                        onWatchlistToggle={() => setIsInWatchlist(!isInWatchlist)}
                        isInWatchlist={isInWatchlist}
                        size="sm"
                    />
                    <MovieCard
                        item={sampleMovie}
                        onCardClick={(item) => console.log("Card clicked:", item)}
                        onWatchlistToggle={() => setIsInWatchlist(!isInWatchlist)}
                        isInWatchlist={isInWatchlist}
                        size="md"
                    />
                    <MovieCard
                        item={sampleMovie}
                        onCardClick={(item) => console.log("Card clicked:", item)}
                        onWatchlistToggle={() => setIsInWatchlist(!isInWatchlist)}
                        isInWatchlist={isInWatchlist}
                        size="lg"
                    />
                </div>
            </section>

            {/* Search Input */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Search Input</h2>
                <div className="max-w-md">
                    <SearchInput
                        placeholder="Search for movies, TV shows..."
                        onSearch={setSearchQuery}
                        onClear={() => setSearchQuery("")}
                    />
                    {searchQuery && <p className="mt-2 text-sm text-muted-foreground">Searching for: {searchQuery}</p>}
                </div>
            </section>

            {/* Rating Bars */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Rating Bars</h2>
                <div className="max-w-md space-y-4">
                    <RatingBar rating={9.0} source="TMDB" />
                    <RatingBar rating={7.5} source="IMDB" />
                    <RatingBar rating={85} maxRating={100} source="Rotten Tomatoes" />
                </div>
                <div className="max-w-md">
                    <h3 className="text-lg font-semibold mb-3">Multiple Ratings</h3>
                    <MultipleRatings ratings={ratings} />
                </div>
            </section>

            {/* Filter Select */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Filter Select</h2>
                <div className="max-w-xs">
                    <FilterSelect
                        value={filterValue}
                        onValueChange={setFilterValue}
                        options={filterOptions}
                        placeholder="Select type..."
                    />
                    <p className="mt-2 text-sm text-muted-foreground">Selected: {filterValue}</p>
                </div>
            </section>

            {/* Empty State */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Empty State</h2>
                <div className="border rounded-lg p-8">
                    <EmptyState
                        icon={<Search className="h-12 w-12" />}
                        title="No results found"
                        description="Try searching for a different movie or TV show using the search bar above."
                        action={{
                            label: "Clear Search",
                            onClick: () => console.log("Clear search clicked"),
                        }}
                    />
                </div>
            </section>

            {/* Pagination */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Pagination</h2>
                <Pagination currentPage={currentPage} totalPages={20} onPageChange={setCurrentPage} />
                <p className="text-sm text-muted-foreground text-center">Current page: {currentPage}</p>
            </section>

            {/* Loading Skeletons */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Loading Skeletons</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Movie Grid Skeleton</h3>
                        <MovieGridSkeleton count={5} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Details Skeleton</h3>
                        <DetailsSkeleton />
                    </div>
                </div>
            </section>

            {/* Modal */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Modal</h2>
                <Modal>
                    <ModalTrigger asChild>
                        <Button>Open Modal</Button>
                    </ModalTrigger>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>Movie Details</ModalTitle>
                        </ModalHeader>
                        <div className="py-4">
                            <p>This is a sample modal content. In the real app, this would show detailed movie information.</p>
                        </div>
                    </ModalContent>
                </Modal>
            </section>
        </div>
    )
}
