import { type NextRequest, NextResponse } from "next/server"
import { getOMDBDetails } from "@/lib/api"

interface RouteParams {
    params: Promise<{ imdbId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { imdbId } = await params

        if (!imdbId || typeof imdbId !== "string") {
            return NextResponse.json({ error: "Invalid IMDb ID" }, { status: 400 })
        }

        const response = await getOMDBDetails(imdbId)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error?.message || "OMDB data not found" },
                { status: response.error?.status || 404 },
            )
        }

        const headers = new Headers()
        headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200")

        return NextResponse.json(response.data, { headers })
    } catch (error) {
        console.error("OMDB API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
