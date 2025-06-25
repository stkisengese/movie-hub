import { type NextRequest, NextResponse } from "next/server"

const watchlists = new Map<string, any[]>()

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get("user_id") || "anonymous"

        const userWatchlist = watchlists.get(userId) || []

        return NextResponse.json({
            watchlist: userWatchlist,
            count: userWatchlist.length,
        })
    } catch (error) {
        console.error("Watchlist GET error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId = "anonymous", item } = body

        if (!item || !item.id || !item.type) {
            return NextResponse.json({ error: "Invalid item data" }, { status: 400 })
        }

        const userWatchlist = watchlists.get(userId) || []
        const existingIndex = userWatchlist.findIndex((w) => w.id === item.id && w.type === item.type)

        if (existingIndex === -1) {
            // Add to watchlist
            userWatchlist.push({
                ...item,
                addedAt: new Date().toISOString(),
            })
            watchlists.set(userId, userWatchlist)

            return NextResponse.json({
                message: "Added to watchlist",
                watchlist: userWatchlist,
            })
        } else {
            // Remove from watchlist
            userWatchlist.splice(existingIndex, 1)
            watchlists.set(userId, userWatchlist)

            return NextResponse.json({
                message: "Removed from watchlist",
                watchlist: userWatchlist,
            })
        }
    } catch (error) {
        console.error("Watchlist POST error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get("user_id") || "anonymous"

        watchlists.delete(userId)

        return NextResponse.json({
            message: "Watchlist cleared",
            watchlist: [],
        })
    } catch (error) {
        console.error("Watchlist DELETE error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
