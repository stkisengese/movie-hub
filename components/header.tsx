"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Film, Bookmark, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { STORAGE_KEYS } from "@/lib/constants"
import type { WatchlistItem } from "@/types"

export function Header() {
    const router = useRouter()
    const [watchlist] = useLocalStorage<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST, [])

    const handleWatchlistClick = () => {
        router.push("/watchlist")
    }

    const handleSearchClick = () => {
        router.push("/search")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo and Brand */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <Film className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
                            <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-lg group-hover:bg-primary-700/30 transition-colors" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                            MovieFlix
                        </h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                        >
                            Home
                        </Link>
                        <Link
                            href="/movies"
                            className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                        >
                            Movies
                        </Link>
                        <Link
                            href="/tv"
                            className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                        >
                            TV Shows
                        </Link>
                        <Link
                            href="/trending"
                            className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                        >
                            Trending
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Button */}
                        <Button variant="ghost" size="icon" onClick={handleSearchClick} className="h-9 w-9 md:hidden">
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>

                        {/* Watchlist Button */}
                        <Button
                            onClick={handleWatchlistClick}
                            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                            size="sm"
                        >
                            <Bookmark className="h-4 w-4" />
                            <span className="hidden md:inline">Watchlist</span>
                            <span className="bg-primary-800 text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                {watchlist.length}
                            </span>
                        </Button>

                        {/* Theme Toggle */}
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="md:hidden mt-4 flex items-center justify-center space-x-6 border-t pt-4">
                    <Link
                        href="/"
                        className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        Home
                    </Link>
                    <Link
                        href="/movies"
                        className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        Movies
                    </Link>
                    <Link
                        href="/tv"
                        className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        TV Shows
                    </Link>
                    <Link
                        href="/trending"
                        className="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        Trending
                    </Link>
                </nav>
            </div>
        </header>
    )
}
