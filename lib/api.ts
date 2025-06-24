import type {
    Movie, TVShow, MediaItem, MovieDetails, TVShowDetails, TMDBResponse, TMDBError, OMDBMovie,
    OMDBError, APIResponse, APIError, SearchParams, TrendingParams, DiscoverParams, Genre,
} from "@/types"

// API Configuration
const API_CONFIG = {
    tmdbBaseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
    omdbBaseUrl: process.env.OMDB_BASE_URL || "https://www.omdbapi.com",
    imageBaseUrl: "https://image.tmdb.org/t/p",
    timeout: 10000,
    retryAttempts: 3,
} as const

// API Key validation
export function validateApiKeys(): { tmdb: boolean; omdb: boolean } {
    const tmdbKey = process.env.TMDB_API_KEY
    const omdbKey = process.env.OMDB_API_KEY

    return {
        tmdb: Boolean(tmdbKey && tmdbKey.length > 0),
        omdb: Boolean(omdbKey && omdbKey.length > 0),
    }
}

// Generic fetch wrapper with error handling and retries
async function apiRequest<T>(
    url: string,
    options: RequestInit = {},
    retries: number = API_CONFIG.retryAttempts,
): Promise<APIResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Check for TMDB API errors
        if (data.success === false) {
            const tmdbError = data as TMDBError
            throw new Error(tmdbError.status_message)
        }

        // Check for OMDB API errors
        if (data.Response === "False") {
            const omdbError = data as OMDBError
            throw new Error(omdbError.Error)
        }

        return {
            data,
            success: true,
        }
    } catch (error) {
        clearTimeout(timeoutId)

        // Retry logic
        if (retries > 0 && error instanceof Error) {
            if (error.name === "AbortError") {
                // Don't retry timeout errors immediately
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
            return apiRequest<T>(url, options, retries - 1)
        }

        const apiError: APIError = {
            message: error instanceof Error ? error.message : "Unknown error occurred",
            status: error instanceof Error && "status" in error ? (error.status as number) : undefined,
            code: error instanceof Error && "code" in error ? (error.code as string) : undefined,
            details: error,
        }

        return {
            error: apiError,
            success: false,
        }
    }
}

// TMDB API functions
export async function getTrending(params: TrendingParams): Promise<APIResponse<TMDBResponse<MediaItem>>> {
    const { tmdb } = validateApiKeys()
    if (!tmdb) {
        return {
            error: { message: "TMDB API key is not configured" },
            success: false,
        }
    }

    const url = `${API_CONFIG.tmdbBaseUrl}/trending/${params.mediaType}/${params.timeWindow}?api_key=${process.env.TMDB_API_KEY}`
    return apiRequest<TMDBResponse<MediaItem>>(url)
}

export async function searchMulti(params: SearchParams): Promise<APIResponse<TMDBResponse<MediaItem>>> {
    const { tmdb } = validateApiKeys()
    if (!tmdb) {
        return {
            error: { message: "TMDB API key is not configured" },
            success: false,
        }
    }

    const searchParams = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY!,
        query: params.query,
        page: params.page.toString(),
        include_adult: "false",
    })

    // Add filters
    if (params.filters.year && params.filters.year !== "all") {
        searchParams.append("year", params.filters.year)
    }

    const url = `${API_CONFIG.tmdbBaseUrl}/search/multi?${searchParams.toString()}`
    return apiRequest<TMDBResponse<MediaItem>>(url)
}

export async function getMovieDetails(id: number): Promise<APIResponse<MovieDetails>> {
    const { tmdb } = validateApiKeys()
    if (!tmdb) {
        return {
            error: { message: "TMDB API key is not configured" },
            success: false,
        }
    }

    const url = `${API_CONFIG.tmdbBaseUrl}/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar,recommendations,external_ids`
    return apiRequest<MovieDetails>(url)
}

export async function getTVShowDetails(id: number): Promise<APIResponse<TVShowDetails>> {
    const { tmdb } = validateApiKeys()
    if (!tmdb) {
        return {
            error: { message: "TMDB API key is not configured" },
            success: false,
        }
    }

    const url = `${API_CONFIG.tmdbBaseUrl}/tv/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar,recommendations,external_ids`
    return apiRequest<TVShowDetails>(url)
}

export async function discoverMovies(params: DiscoverParams): Promise<APIResponse<TMDBResponse<Movie>>> {
    const { tmdb } = validateApiKeys()
    if (!tmdb) {
        return {
            error: { message: "TMDB API key is not configured" },
            success: false,
        }
    }

    const searchParams = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY!,
        page: (params.page || 1).toString(),
        include_adult: "false",
    })

    if (params.sortBy) searchParams.append("sort_by", params.sortBy)
    if (params.year) searchParams.append("year", params.year.toString())
    if (params.genreIds?.length) searchParams.append("with_genres", params.genreIds.join(","))
    if (params.minVoteAverage) searchParams.append("vote_average.gte", params.minVoteAverage.toString())
    if (params.minVoteCount) searchParams.append("vote_count.gte", params.minVoteCount.toString())
    if (params.language) searchParams.append("language", params.language)

    const url = `${API_CONFIG.tmdbBaseUrl}/discover/movie?${searchParams.toString()}`
    return apiRequest<TMDBResponse<Movie>>(url)
}

export async function discoverTVShows(params: DiscoverParams): Promise<APIResponse<TMDBResponse<TVShow>>> {
    const { tmdb } = validateApiKeys()
    if (!tmdb) {
        return {
            error: { message: "TMDB API key is not configured" },
            success: false,
        }
    }

    const searchParams = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY!,
        page: (params.page || 1).toString(),
        include_adult: "false",
    })

    if (params.sortBy) searchParams.append("sort_by", params.sortBy)
    if (params.year) searchParams.append("first_air_date_year", params.year.toString())
    if (params.genreIds?.length) searchParams.append("with_genres", params.genreIds.join(","))
    if (params.minVoteAverage) searchParams.append("vote_average.gte", params.minVoteAverage.toString())
    if (params.minVoteCount) searchParams.append("vote_count.gte", params.minVoteCount.toString())
    if (params.language) searchParams.append("language", params.language)

    const url = `${API_CONFIG.tmdbBaseUrl}/discover/tv?${searchParams.toString()}`
    return apiRequest<TMDBResponse<TVShow>>(url)
}

export async function getGenres(mediaType: "movie" | "tv"): Promise<APIResponse<{ genres: Genre[] }>> {
    const { tmdb } = validateApiKeys()
    if (!tmdb) {
        return {
            error: { message: "TMDB API key is not configured" },
            success: false,
        }
    }

    const url = `${API_CONFIG.tmdbBaseUrl}/genre/${mediaType}/list?api_key=${process.env.TMDB_API_KEY}`
    return apiRequest<{ genres: Genre[] }>(url)
}
