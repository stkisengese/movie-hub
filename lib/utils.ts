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

// Validation utilities
export function isValidIMDBId(id: string): boolean {
  return VALIDATION.IMDB_ID.test(id)
}

export function isValidYear(year: string): boolean {
  return VALIDATION.YEAR.test(year)
}

export function isValidRating(rating: string): boolean {
  return VALIDATION.RATING.test(rating)
}

// String utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

// Array utilities
export function removeDuplicates<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)]
  }

  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

export function sortByProperty<T>(array: T[], property: keyof T, order: "asc" | "desc" = "asc"): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[property]
    const bValue = b[property]

    if (aValue < bValue) return order === "asc" ? -1 : 1
    if (aValue > bValue) return order === "asc" ? 1 : -1
    return 0
  })
}

// Local storage utilities
export function safeLocalStorage() {
  const isClient = typeof window !== "undefined"

  return {
    getItem: (key: string): string | null => {
      if (!isClient) return null
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string): void => {
      if (!isClient) return
      try {
        localStorage.setItem(key, value)
      } catch {
        // Silently fail
      }
    },
    removeItem: (key: string): void => {
      if (!isClient) return
      try {
        localStorage.removeItem(key)
      } catch {
        // Silently fail
      }
    },
  }
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// URL utilities
export function buildSearchParams(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

// Number utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Movie/TV specific utilities
export function getMovieTitle(details: any): string {
  return details?.title || details?.name || "Unknown Title"
}

export function getMovieYear(details: any): string {
  const date = details?.release_date || details?.first_air_date
  return formatYear(date)
}

export function getMovieRuntime(details: any): string {
  if (details?.runtime) {
    return formatRuntime(details.runtime)
  }
  if (details?.episode_run_time && details.episode_run_time.length > 0) {
    return formatRuntime(details.episode_run_time[0])
  }
  return "Unknown"
}