// Client-side API functions that call our Next.js API routes
import type { MediaItem, MovieDetails, TVShowDetails, TMDBResponse, Genre } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || ""

class APIClient {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${API_BASE}/api${endpoint}`

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Unknown error" }))
            throw new Error(error.error || `HTTP ${response.status}`)
        }

        return response.json()
    }

    // Trending content
    async getTrending(
        mediaType: "all" | "movie" | "tv" = "all",
        timeWindow: "day" | "week" = "week",
    ): Promise<TMDBResponse<MediaItem>> {
        return this.request(`/movies/trending?media_type=${mediaType}&time_window=${timeWindow}`)
    }

    // Search
    async search(params: {
        query: string
        page?: number
        type?: string
        year?: string
        genre?: string
        sortBy?: string
        sortOrder?: string
    }): Promise<TMDBResponse<MediaItem>> {
        const searchParams = new URLSearchParams({
            q: params.query,
            page: (params.page || 1).toString(),
            ...(params.type && { type: params.type }),
            ...(params.year && { year: params.year }),
            ...(params.genre && { genre: params.genre }),
            ...(params.sortBy && { sort_by: params.sortBy }),
            ...(params.sortOrder && { sort_order: params.sortOrder }),
        })

        return this.request(`/movies/search?${searchParams.toString()}`)
    }

    // Movie details
    async getMovieDetails(id: number): Promise<MovieDetails> {
        return this.request(`/movies/${id}`)
    }

    // TV show details
    async getTVShowDetails(id: number): Promise<TVShowDetails> {
        return this.request(`/tv/${id}`)
    }

    // Discover
    async discover(params: {
        mediaType: "movie" | "tv"
        page?: number
        sortBy?: string
        year?: number
        genreIds?: number[]
        minVoteAverage?: number
        minVoteCount?: number
        language?: string
    }): Promise<TMDBResponse<MediaItem>> {
        const searchParams = new URLSearchParams({
            media_type: params.mediaType,
            page: (params.page || 1).toString(),
            ...(params.sortBy && { sort_by: params.sortBy }),
            ...(params.year && { year: params.year.toString() }),
            ...(params.genreIds && { with_genres: params.genreIds.join(",") }),
            ...(params.minVoteAverage && { "vote_average.gte": params.minVoteAverage.toString() }),
            ...(params.minVoteCount && { "vote_count.gte": params.minVoteCount.toString() }),
            ...(params.language && { language: params.language }),
        })

        return this.request(`/movies/discover?${searchParams.toString()}`)
    }

    // Genres
    async getGenres(mediaType: "movie" | "tv" = "movie"): Promise<{ genres: Genre[] }> {
        return this.request(`/genres?media_type=${mediaType}`)
    }

    // Health check
    async healthCheck(): Promise<{
        status: string
        timestamp: string
        services: Record<string, string>
        version: string
    }> {
        return this.request("/health")
    }

    // Watchlist (server-side storage demo)
    async getWatchlist(userId?: string): Promise<{ watchlist: any[]; count: number }> {
        const params = userId ? `?user_id=${userId}` : ""
        return this.request(`/watchlist${params}`)
    }

    async toggleWatchlist(item: any, userId?: string): Promise<{ message: string; watchlist: any[] }> {
        return this.request("/watchlist", {
            method: "POST",
            body: JSON.stringify({ userId, item }),
        })
    }

    async clearWatchlist(userId?: string): Promise<{ message: string; watchlist: any[] }> {
        const params = userId ? `?user_id=${userId}` : ""
        return this.request(`/watchlist${params}`, {
            method: "DELETE",
        })
    }
}

export const apiClient = new APIClient()
