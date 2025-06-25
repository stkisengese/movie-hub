// Simple in-memory cache for server-side API responses
interface CacheItem<T> {
    data: T
    timestamp: number
    ttl: number
}

class MemoryCache {
    private cache = new Map<string, CacheItem<any>>()

    set<T>(key: string, data: T, ttlSeconds = 300): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlSeconds * 1000,
        })
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key)

        if (!item) {
            return null
        }

        const now = Date.now()
        if (now - item.timestamp > item.ttl) {
            this.cache.delete(key)
            return null
        }

        return item.data
    }

    delete(key: string): boolean {
        return this.cache.delete(key)
    }

    clear(): void {
        this.cache.clear()
    }

    // Clean up expired entries
    cleanup(): void {
        const now = Date.now()
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key)
            }
        }
    }

    // Get cache stats
    getStats(): {
        size: number
        keys: string[]
        memoryUsage: number
    } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length,
        }
    }
}

export const cache = new MemoryCache()

// Clean up expired entries every 5 minutes
if (typeof window === "undefined") {
    setInterval(
        () => {
            cache.cleanup()
        },
        5 * 60 * 1000,
    )
}

// Cache key generators
export const cacheKeys = {
    trending: (mediaType: string, timeWindow: string) => `trending:${mediaType}:${timeWindow}`,
    search: (query: string, page: number, filters: string) => `search:${query}:${page}:${filters}`,
    movieDetails: (id: number) => `movie:${id}`,
    tvDetails: (id: number) => `tv:${id}`,
    discover: (mediaType: string, params: string) => `discover:${mediaType}:${params}`,
    genres: (mediaType: string) => `genres:${mediaType}`,
}
