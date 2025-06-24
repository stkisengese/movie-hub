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
