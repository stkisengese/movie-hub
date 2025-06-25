"use client"

import { useEffect, useCallback, useRef } from "react"

interface UseInfiniteScrollOptions {
    hasNextPage: boolean
    isLoading: boolean
    onLoadMore: () => void
    threshold?: number
    rootMargin?: string
}

export function useInfiniteScroll({
    hasNextPage,
    isLoading,
    onLoadMore,
    threshold = 1.0,
    rootMargin = "100px",
}: UseInfiniteScrollOptions) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadingRef = useRef<HTMLDivElement | null>(null)

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries
            if (target.isIntersecting && hasNextPage && !isLoading) {
                onLoadMore()
            }
        },
        [hasNextPage, isLoading, onLoadMore],
    )

    useEffect(() => {
        const element = loadingRef.current
        if (!element) return

        observerRef.current = new IntersectionObserver(handleObserver, {
            threshold,
            rootMargin,
        })

        observerRef.current.observe(element)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [handleObserver, threshold, rootMargin])

    return { loadingRef }
}
