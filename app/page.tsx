"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeroSection } from "@/components/home/hero-section"
import { TrendingSection } from "@/components/home/trending-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { StatsSection } from "@/components/home/stats-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { MovieDetailModal } from "@/components/movie/movie-detail-modal"
import { useTrendingMovies, useWatchlist } from "@/hooks"
import type { MediaItem } from "@/types"

export default function HomePage() {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hooks
  const trending = useTrendingMovies()
  const watchlist = useWatchlist()

  // Get featured items for hero (top 5 trending)
  const featuredItems = trending.movies.slice(0, 5)

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handlePlayClick = (item: MediaItem) => {
    // Navigate to dedicated page for full experience
    const path = item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`
    router.push(path)
  }

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to category-specific pages
    switch (categoryId) {
      case "trending-movies":
        router.push("/movies?filter=trending")
        break
      case "trending-tv":
        router.push("/tv?filter=trending")
        break
      case "top-rated-movies":
        router.push("/movies?filter=top-rated")
        break
      case "top-rated-tv":
        router.push("/tv?filter=top-rated")
        break
      case "new-releases":
        router.push("/movies?filter=new-releases")
        break
      case "classic-movies":
        router.push("/movies?filter=classic")
        break
      default:
        router.push("/search")
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection featuredItems={featuredItems} onPlayClick={handlePlayClick} onInfoClick={handleItemClick} />

      {/* Trending Movies Section */}
      <TrendingSection
        title="Trending Now"
        items={trending.movies.filter((item) => item.media_type === "movie").slice(0, 20)}
        isLoading={trending.isLoading}
        onItemClick={handleItemClick}
        onWatchlistToggle={watchlist.toggleWatchlist}
        isInWatchlist={watchlist.isInWatchlist}
      />

      {/* Trending TV Shows Section */}
      <TrendingSection
        title="Popular TV Shows"
        items={trending.movies.filter((item) => item.media_type === "tv").slice(0, 20)}
        isLoading={trending.isLoading}
        onItemClick={handleItemClick}
        onWatchlistToggle={watchlist.toggleWatchlist}
        isInWatchlist={watchlist.isInWatchlist}
      />

      {/* Categories Section */}
      <CategoriesSection onCategoryClick={handleCategoryClick} />

      {/* Stats Section */}
      <StatsSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Movie Details Modal */}
      <MovieDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
        }}
        onPlayClick={handlePlayClick}
      />
    </div>
  )
}
