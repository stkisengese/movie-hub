import { Bookmark } from "lucide-react"

export default function WatchlistPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center py-20">
                <Bookmark className="h-16 w-16 mx-auto mb-6 text-primary-600" />
                <h1 className="text-4xl font-bold mb-4">My Watchlist</h1>
                <p className="text-lg text-muted-foreground">Keep track of movies and shows you want to watch.</p>
                <p className="text-sm text-muted-foreground mt-4">This page will be implemented in upcoming issues.</p>
            </div>
        </div>
    )
}
