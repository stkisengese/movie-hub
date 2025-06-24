import { TrendingUp } from "lucide-react"

export default function TrendingPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center py-20">
                <TrendingUp className="h-16 w-16 mx-auto mb-6 text-primary-600" />
                <h1 className="text-4xl font-bold mb-4">Trending</h1>
                <p className="text-lg text-muted-foreground">See what's trending in movies and TV shows right now.</p>
                <p className="text-sm text-muted-foreground mt-4">This page will be implemented in upcoming issues.</p>
            </div>
        </div>
    )
}
