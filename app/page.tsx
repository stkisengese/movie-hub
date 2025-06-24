import { Film, TrendingUp, Search, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-500/20 rounded-full blur-3xl" />
            <Film className="relative h-20 w-20 mx-auto text-primary-600 mb-6" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              MovieFlix
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover trending movies and TV shows, create your personal watchlist, and explore detailed information
            about your favorite entertainment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/trending">
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Trending
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/search">
                <Search className="mr-2 h-5 w-5" />
                Search Movies
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to discover great entertainment</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border bg-card">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-xl font-semibold mb-2">Trending Content</h3>
              <p className="text-muted-foreground">
                Stay up to date with the latest trending movies and TV shows from around the world.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border bg-card">
              <Search className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-muted-foreground">
                Find exactly what you're looking for with powerful search and filtering options.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border bg-card">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-xl font-semibold mb-2">Personal Watchlist</h3>
              <p className="text-muted-foreground">
                Keep track of movies and shows you want to watch with your personal watchlist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to start exploring?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of movie enthusiasts discovering their next favorite film or show.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/trending">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
