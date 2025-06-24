import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MediaItem, WatchlistItem, WatchlistStats } from "@/types"
import { VALIDATION } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: string): string {
  if (!date) return "Unknown"
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatYear(date: string): string {
  if (!date) return "Unknown"
  return new Date(date).getFullYear().toString()
}

export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return "Unknown"
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// Rating utilities
export function formatRating(rating: number): string {
  if (!rating || rating <= 0) return "N/A"
  return rating.toFixed(1)
}

export function getRatingColor(rating: number): string {
  if (rating >= 8) return "text-green-500"
  if (rating >= 6) return "text-yellow-500"
  if (rating >= 4) return "text-orange-500"
  return "text-red-500"
}

export function getRatingPercentage(rating: number, maxRating = 10): number {
  return Math.min(Math.max((rating / maxRating) * 100, 0), 100)
}

// Media utilities
export function getMediaTitle(item: MediaItem): string {
  return item.title || item.name || "Unknown Title"
}

export function getMediaYear(item: MediaItem): string {
  const date = item.release_date || item.first_air_date || "";
  return formatYear(date)
}

export function getMediaType(item: MediaItem): "Movie" | "TV Show" | "Person" {
  switch (item.media_type) {
    case "movie":
      return "Movie"
    case "tv":
      return "TV Show"
    case "person":
      return "Person"
    default:
      return "Movie"
  }
}

// Watchlist utilities
export function calculateWatchlistStats(watchlist: WatchlistItem[]): WatchlistStats {
  const total = watchlist.length
  const movies = watchlist.filter((item) => item.type === "movie").length
  const tvShows = watchlist.filter((item) => item.type === "tv").length
  const watched = watchlist.filter((item) => item.watched).length
  const unwatched = total - watched

  const ratingsSum = watchlist
    .filter((item) => item.rating && item.rating > 0)
    .reduce((sum, item) => sum + (item.rating || 0), 0)

  const ratedItems = watchlist.filter((item) => item.rating && item.rating > 0).length
  const averageRating = ratedItems > 0 ? ratingsSum / ratedItems : 0

  return {
    total,
    movies,
    tvShows,
    watched,
    unwatched,
    averageRating,
  }
}

