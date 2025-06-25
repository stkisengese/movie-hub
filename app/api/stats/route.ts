import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"

export async function GET() {
    try {
        const stats = {
            timestamp: new Date().toISOString(),
            cache: cache.getStats(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
            },
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error("Stats API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
