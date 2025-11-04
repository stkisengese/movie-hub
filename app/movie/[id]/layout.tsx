import type React from "react"
import type { Metadata } from "next"
import { getMovieDetails } from "@/lib/api"

interface MovieLayoutProps {
    children: React.ReactNode
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params
        const movieId = Number.parseInt(id)

        const response = await getMovieDetails(movieId)

        if (!response.success || !response.data) {
            return {
                title: "Movie Details | MovieFlix",
                description: "Explore detailed information about this movie on MovieFlix.",
            }
        }

        const movie = response.data
        const title = movie.title || "Unknown Movie"
        const description = movie.overview || "Explore detailed information about this movie on MovieFlix."
        const posterImage = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined
        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : ""

        return {
            title: `${title} ${releaseYear ? `(${releaseYear})` : ""} | MovieFlix`,
            description: description.substring(0, 160),
            keywords: ["movie", "details", title, ...(movie.genres?.map((g: any) => g.name) || [])],
            openGraph: {
                title: `${title} ${releaseYear ? `(${releaseYear})` : ""}`,
                description: description.substring(0, 160),
                type: "video.movie",
                url: `/movie/${movieId}`,
                images: posterImage ? [{ url: posterImage, width: 500, height: 750, alt: title }] : [],
                ...(releaseYear && { releaseDate: `${releaseYear}-01-01` }),
            },
            twitter: {
                card: "summary_large_image",
                title: `${title} ${releaseYear ? `(${releaseYear})` : ""}`,
                description: description.substring(0, 160),
                images: posterImage ? [posterImage] : [],
            },
        }
    } catch (error) {
        return {
            title: "Movie Details | MovieFlix",
            description: "Explore detailed information about this movie on MovieFlix.",
        }
    }
}

export default function MovieLayout({ children }: MovieLayoutProps) {
    return children
}
