import { type NextRequest, NextResponse } from "next/server"
import { getGenres } from "@/lib/api"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const mediaType = (searchParams.get("media_type") as "movie" | "tv") || "movie"

        const response = await getGenres(mediaType)

        if (!response.success) {
            return NextResponse.json({ error: response.error?.message || "Failed to fetch genres" }, { status: 500 })
        }

        // Set cache headers for 24 hours for genres (they don't change often)
        const headers = new Headers()
        headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200")

        return NextResponse.json(response.data, { headers })
    } catch (error) {
        console.error("Genres API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
