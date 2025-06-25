"use client"

import { useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"
import { STORAGE_KEYS } from "@/lib/constants"

interface SearchHistoryItem {
    query: string
    timestamp: string
    resultsCount: number
}

export function useSearchHistory() {
    const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>(STORAGE_KEYS.SEARCH_HISTORY, [])

    // Add search to history
    const addToHistory = useCallback(
        (query: string, resultsCount: number) => {
            if (!query.trim()) return

            const newItem: SearchHistoryItem = {
                query: query.trim(),
                timestamp: new Date().toISOString(),
                resultsCount,
            }

            setSearchHistory((prev) => {
                // Remove existing entry with same query
                const filtered = prev.filter((item) => item.query.toLowerCase() !== query.toLowerCase())
                // Add new item to beginning and limit to 10 items
                return [newItem, ...filtered].slice(0, 10)
            })
        },
        [setSearchHistory],
    )

    // Remove item from history
    const removeFromHistory = useCallback(
        (query: string) => {
            setSearchHistory((prev) => prev.filter((item) => item.query !== query))
        },
        [setSearchHistory],
    )

    // Clear all history
    const clearHistory = useCallback(() => {
        setSearchHistory([])
    }, [setSearchHistory])

    // Get recent searches
    const getRecentSearches = useCallback(
        (limit = 5) => {
            return searchHistory.slice(0, limit)
        },
        [searchHistory],
    )

    return {
        searchHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getRecentSearches,
    }
}
