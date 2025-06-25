import { type NextRequest, NextResponse } from "next/server"
import { getTVShowDetails } from "@/lib/api"

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const tvId = Number.parseInt(id)

        if (isNaN(tvId)) {
            return NextResponse.json({ error: "Invalid TV show ID" }, { status: 400 })
        }

        const response = await getTVShowDetails(tvId)

        if (!response.success) {
            return NextResponse.json(
                { error: response.error?.message || "TV show not found" },
                { status: response.error?.status || 404 },
            )
        }

        // Set cache headers for 1 hour for TV show details
        const headers = new Headers()
        headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=1800")

        return NextResponse.json(response.data, { headers })
    } catch (error) {
        console.error("TV show details API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
