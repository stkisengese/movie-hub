import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // Add CORS headers for API routes
    if (request.nextUrl.pathname.startsWith("/api/")) {
        const response = NextResponse.next()

        // Add CORS headers
        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        // Add security headers
        response.headers.set("X-Content-Type-Options", "nosniff")
        response.headers.set("X-Frame-Options", "DENY")
        response.headers.set("X-XSS-Protection", "1; mode=block")

        return response
    }

    // Add security headers for all routes
    const response = NextResponse.next()
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
