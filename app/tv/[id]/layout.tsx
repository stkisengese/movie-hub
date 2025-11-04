import type React from "react"
import type { Metadata } from "next"
import { getTVShowDetails } from "@/lib/api"

interface TVLayoutProps {
    children: React.ReactNode
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params
        const tvId = Number.parseInt(id)

        const response = await getTVShowDetails(tvId)

        if (!response.success || !response.data) {
            return {
                title: "TV Show Details | MovieFlix",
                description: "Explore detailed information about this TV show on MovieFlix.",
            }
        }

        const show = response.data
        const title = show.name || "Unknown TV Show"
        const description = show.overview || "Explore detailed information about this TV show on MovieFlix."
        const posterImage = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined
        const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : ""

        return {
            title: `${title} ${firstAirYear ? `(${firstAirYear})` : ""} | MovieFlix`,
            description: description.substring(0, 160),
            keywords: ["tv show", "series", "details", title, ...(show.genres?.map((g: any) => g.name) || [])],
            openGraph: {
                title: `${title} ${firstAirYear ? `(${firstAirYear})` : ""}`,
                description: description.substring(0, 160),
                type: "video.tv_show",
                url: `/tv/${tvId}`,
                images: posterImage ? [{ url: posterImage, width: 500, height: 750, alt: title }] : [],
                ...(firstAirYear && { releaseDate: `${firstAirYear}-01-01` }),
            },
            twitter: {
                card: "summary_large_image",
                title: `${title} ${firstAirYear ? `(${firstAirYear})` : ""}`,
                description: description.substring(0, 160),
                images: posterImage ? [posterImage] : [],
            },
        }
    } catch (error) {
        return {
            title: "TV Show Details | MovieFlix",
            description: "Explore detailed information about this TV show on MovieFlix.",
        }
    }
}

export default function TVLayout({ children }: TVLayoutProps) {
    return children
}
