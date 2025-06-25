import { NextResponse } from "next/server"
import { validateApiKeys } from "@/lib/api"

export async function GET() {
    try {
        const apiKeys = validateApiKeys()

        const health = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            services: {
                tmdb: apiKeys.tmdb ? "connected" : "disconnected",
                omdb: apiKeys.omdb ? "connected" : "disconnected",
            },
            version: process.env.npm_package_version || "unknown",
        }

        const status = apiKeys.tmdb && apiKeys.omdb ? 200 : 503

        return NextResponse.json(health, { status })
    } catch (error) {
        console.error("Health check error:", error)
        return NextResponse.json(
            {
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                error: "Service unavailable",
            },
            { status: 503 },
        )
    }
}
