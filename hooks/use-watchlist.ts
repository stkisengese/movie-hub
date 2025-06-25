"use client"

import { useCallback, useMemo } from "react"
import { useLocalStorage } from "./use-local-storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { calculateWatchlistStats } from "@/lib/utils"
import type { WatchlistItem, MediaItem, WatchlistStats } from "@/types"

export function useWatchlist() {
    const [watchlist, setWatchlist, clearWatchlist] = useLocalStorage<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST, [])

    // Check if an item is in the watchlist
    const isInWatchlist = useCallback(
        (id: number, type: "movie" | "tv"): boolean => {
            return watchlist.some((item) => item.id === id && item.type === type)
        },
        [watchlist],
    )

    // Add item to watchlist
    const addToWatchlist = useCallback(
        (mediaItem: MediaItem) => {
            if (isInWatchlist(mediaItem.id, mediaItem.media_type as "movie" | "tv")) {
                return // Already in watchlist
            }

            const watchlistItem: WatchlistItem = {
                id: mediaItem.id,
                type: mediaItem.media_type as "movie" | "tv",
                title: mediaItem.title || mediaItem.name || "Unknown Title",
                poster_path: mediaItem.poster_path,
                vote_average: mediaItem.vote_average,
                release_date: mediaItem.release_date || mediaItem.first_air_date || "",
                watched: false,
                addedAt: new Date().toISOString(),
            }

            setWatchlist((prev) => [watchlistItem, ...prev])
        },
        [isInWatchlist, setWatchlist],
    )

    // Remove item from watchlist
    const removeFromWatchlist = useCallback(
        (id: number, type: "movie" | "tv") => {
            setWatchlist((prev) => prev.filter((item) => !(item.id === id && item.type === type)))
        },
        [setWatchlist],
    )

    // Toggle item in watchlist
    const toggleWatchlist = useCallback(
        (mediaItem: MediaItem) => {
            const type = mediaItem.media_type as "movie" | "tv"
            if (isInWatchlist(mediaItem.id, type)) {
                removeFromWatchlist(mediaItem.id, type)
            } else {
                addToWatchlist(mediaItem)
            }
        },
        [isInWatchlist, addToWatchlist, removeFromWatchlist],
    )

    // Mark item as watched/unwatched
    const toggleWatched = useCallback(
        (id: number, type: "movie" | "tv") => {
            setWatchlist((prev) =>
                prev.map((item) => {
                    if (item.id === id && item.type === type) {
                        return {
                            ...item,
                            watched: !item.watched,
                            watchedAt: !item.watched ? new Date().toISOString() : undefined,
                        }
                    }
                    return item
                }),
            )
        },
        [setWatchlist],
    )

    // Update item rating
    const updateRating = useCallback(
        (id: number, type: "movie" | "tv", rating: number) => {
            setWatchlist((prev) =>
                prev.map((item) => {
                    if (item.id === id && item.type === type) {
                        return { ...item, rating }
                    }
                    return item
                }),
            )
        },
        [setWatchlist],
    )

    // Update item notes
    const updateNotes = useCallback(
        (id: number, type: "movie" | "tv", notes: string) => {
            setWatchlist((prev) =>
                prev.map((item) => {
                    if (item.id === id && item.type === type) {
                        return { ...item, notes }
                    }
                    return item
                }),
            )
        },
        [setWatchlist],
    )

    // Get filtered watchlist
    const getFilteredWatchlist = useCallback(
        (filter: "all" | "movies" | "tv" | "watched" | "unwatched") => {
            switch (filter) {
                case "movies":
                    return watchlist.filter((item) => item.type === "movie")
                case "tv":
                    return watchlist.filter((item) => item.type === "tv")
                case "watched":
                    return watchlist.filter((item) => item.watched)
                case "unwatched":
                    return watchlist.filter((item) => !item.watched)
                default:
                    return watchlist
            }
        },
        [watchlist],
    )

    // Calculate watchlist statistics
    const stats: WatchlistStats = useMemo(() => calculateWatchlistStats(watchlist), [watchlist])

    return {
        watchlist,
        stats,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        toggleWatched,
        updateRating,
        updateNotes,
        getFilteredWatchlist,
        clearWatchlist,
    }
}
