// Core movie and TV show types
export interface Movie {
    id: number
    title: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string
    vote_average: number
    vote_count: number
    genre_ids: number[]
    adult: boolean
    original_language: string
    original_title: string
    popularity: number
    video: boolean
  }
  
  export interface TVShow {
    id: number
    name: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    first_air_date: string
    vote_average: number
    vote_count: number
    genre_ids: number[]
    adult: boolean
    original_language: string
    original_name: string
    popularity: number
    origin_country: string[]
  }
  
  export interface MediaItem {
    id: number
    media_type: "movie" | "tv"
    title?: string
    name?: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date?: string
    first_air_date?: string
    vote_average: number
    vote_count: number
    genre_ids: number[]
    adult: boolean
    popularity: number
  }
  
  // API Response types
  export interface TMDBResponse<T> {
    page: number
    results: T[]
    total_pages: number
    total_results: number
  }
  
  export interface Genre {
    id: number
    name: string
  }
  
  // Watchlist types
  export interface WatchlistItem {
    id: number
    type: "movie" | "tv"
    watched: boolean
    addedAt: string
  }
  
  // Search and filter types
  export interface SearchFilters {
    type: "all" | "movie" | "tv"
    year: string
    genre: string
  }
  