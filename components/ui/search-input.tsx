"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onSearch?: (query: string) => void
    onClear?: () => void
    debounceMs?: number
    showClearButton?: boolean
}

export function SearchInput({
    className,
    onSearch,
    onClear,
    debounceMs = 500,
    showClearButton = true,
    ...props
}: SearchInputProps) {
    const [query, setQuery] = React.useState("")
    const debouncedQuery = useDebounce(query, debounceMs)

    React.useEffect(() => {
        onSearch?.(debouncedQuery)
    }, [debouncedQuery, onSearch])

    const handleClear = () => {
        setQuery("")
        onClear?.()
    }

    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                    "flex h-12 w-full rounded-full border border-input bg-background px-12 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                {...props}
            />
            {showClearButton && query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
