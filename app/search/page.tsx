import { Search } from "lucide-react"

export default function SearchPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center py-20">
                <Search className="h-16 w-16 mx-auto mb-6 text-primary-600" />
                <h1 className="text-4xl font-bold mb-4">Search</h1>
                <p className="text-lg text-muted-foreground">Search for your favorite movies and TV shows.</p>
                <p className="text-sm text-muted-foreground mt-4">This page will be implemented later.</p>
            </div>
        </div>
    )
}
