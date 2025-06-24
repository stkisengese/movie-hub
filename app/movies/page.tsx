import { Film } from "lucide-react"

export default function MoviesPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center py-20">
                <Film className="h-16 w-16 mx-auto mb-6 text-primary-600" />
                <h1 className="text-4xl font-bold mb-4">Movies</h1>
                <p className="text-lg text-muted-foreground">Discover amazing movies from all genres and eras.</p>
                <p className="text-sm text-muted-foreground mt-4">This page will be implemented later.</p>
            </div>
        </div>
    )
}
