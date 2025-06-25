"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const media = window.matchMedia(query)

        // Set initial value
        setMatches(media.matches)

        // Create event listener
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        // Add listener
        if (media.addEventListener) {
            media.addEventListener("change", listener)
        } else {
            // Fallback for older browsers
            media.addListener(listener)
        }

        // Cleanup
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener("change", listener)
            } else {
                // Fallback for older browsers
                media.removeListener(listener)
            }
        }
    }, [query])

    return matches
}

// Convenience hooks for common breakpoints
export function useIsMobile() {
    return useMediaQuery("(max-width: 768px)")
}

export function useIsTablet() {
    return useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
}

export function useIsDesktop() {
    return useMediaQuery("(min-width: 1025px)")
}

export function useIsDarkMode() {
    return useMediaQuery("(prefers-color-scheme: dark)")
}
