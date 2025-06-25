import { type NextRequest, NextResponse } from "next/server"
import { getTrending } from "@/lib/api"
import type { TrendingParams } from "@/types"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const mediaType = (searchParams.get("media_type") as "all" | "movie" | "tv") || "all"
        const timeWindow = (searchParams.get("time_window") as "day" | "week") || "week"

        const params: TrendingParams = {
            mediaType,
            timeWindow,
        }

        const response = await getTrending(params)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error?.message || "Failed to fetch trending content" },
                { status: 500 },
            )
        }

        // Set cache headers for 10 minutes
        const headers = new Headers()
        headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=300")

        return NextResponse.json(response.data, { headers })
    } catch (error) {
        console.error("Trending API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
