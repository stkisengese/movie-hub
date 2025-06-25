import { type NextRequest, NextResponse } from "next/server"
import { searchMulti } from "@/lib/api"
import type { SearchParams } from "@/types"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get("q")

        if (!query) {
            return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
        }

        const page = Number.parseInt(searchParams.get("page") || "1")
        const type = searchParams.get("type") || "all"
        const year = searchParams.get("year") || "all"
        const genre = searchParams.get("genre") || "all"
        const sortBy = searchParams.get("sort_by") || "popularity"
        const sortOrder = searchParams.get("sort_order") || "desc"

        const params: SearchParams = {
            query,
            page,
            filters: {
                type: type as any,
                year,
                genre,
                sortBy: sortBy as any,
                sortOrder: sortOrder as any,
            },
        }

        const response = await searchMulti(params)

        if (!response.success) {
            return NextResponse.json({ error: response.error?.message || "Search failed" }, { status: 500 })
        }

        // Set cache headers for 5 minutes for search results
        const headers = new Headers()
        headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=150")

        return NextResponse.json(response.data, { headers })
    } catch (error) {
        console.error("Search API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
