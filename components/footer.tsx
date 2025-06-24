import Link from "next/link"
import { Film, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Film className="h-6 w-6 text-primary-600" />
                            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                                MovieFlix
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Discover trending movies and TV shows, create your personal watchlist, and explore detailed information
                            about your favorite entertainment.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Navigation</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Movies
                                </Link>
                            </li>
                            <li>
                                <Link href="/tv" className="text-muted-foreground hover:text-foreground transition-colors">
                                    TV Shows
                                </Link>
                            </li>
                            <li>
                                <Link href="/trending" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Trending
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Features</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Search
                                </Link>
                            </li>
                            <li>
                                <Link href="/watchlist" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Watchlist
                                </Link>
                            </li>
                            <li>
                                <span className="text-muted-foreground">Dark Mode</span>
                            </li>
                            <li>
                                <span className="text-muted-foreground">Responsive Design</span>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Connect</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a
                                href="mailto:contact@movieflix.com"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} MovieFlix. All rights reserved. |{" "}
                        <span className="text-xs">
                            Powered by{" "}
                            <a
                                href="https://www.themoviedb.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                TMDB
                            </a>{" "}
                            and{" "}
                            <a
                                href="http://www.omdbapi.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                OMDB
                            </a>
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
