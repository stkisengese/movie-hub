"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useTheme() {
    const { theme, setTheme, resolvedTheme } = useNextTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const isDark = resolvedTheme === "dark"
    const isLight = resolvedTheme === "light"

    return {
        theme,
        setTheme,
        resolvedTheme,
        toggleTheme,
        isDark,
        isLight,
        mounted,
    }
}
