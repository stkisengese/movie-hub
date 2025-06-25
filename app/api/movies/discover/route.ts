import { type NextRequest, NextResponse } from "next/server"
import { discoverMovies, discoverTVShows } from "@/lib/api"
import type { DiscoverParams } from "@/types"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const mediaType = (searchParams.get("media_type") as "movie" | "tv") || "movie"
        const page = Number.parseInt(searchParams.get("page") || "1")
        const sortBy = searchParams.get("sort_by") || "popularity.desc"
        const year = searchParams.get("year")
        const genreIds = searchParams.get("with_genres")
        const minVoteAverage = searchParams.get("vote_average.gte")
        const minVoteCount = searchParams.get("vote_count.gte")
        const language = searchParams.get("language") || "en-US"

        const params: DiscoverParams = {
            mediaType,
            page,
            sortBy,
            ...(year && { year: Number.parseInt(year) }),
            ...(genreIds && { genreIds: genreIds.split(",").map((id) => Number.parseInt(id)) }),
            ...(minVoteAverage && { minVoteAverage: Number.parseFloat(minVoteAverage) }),
            ...(minVoteCount && { minVoteCount: Number.parseInt(minVoteCount) }),
            language,
        }

        const response = mediaType === "movie" ? await discoverMovies(params) : await discoverTVShows(params)

        if (!response.success) {
            return NextResponse.json({ error: response.error?.message || "Discovery failed" }, { status: 500 })
        }

        // Set cache headers for 15 minutes for discover results
        const headers = new Headers()
        headers.set("Cache-Control", "public, s-maxage=900, stale-while-revalidate=450")

        return NextResponse.json(response.data, { headers })
    } catch (error) {
        console.error("Discover API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
