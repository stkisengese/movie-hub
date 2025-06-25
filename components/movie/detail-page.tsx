"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Play, Plus, Check, Star, Calendar, Clock, Monitor, ExternalLink, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MultipleRatings } from "@/components/ui/rating-bar"
import { MovieCard } from "@/components/ui/movie-card"
import { DetailsSkeleton } from "@/components/ui/loading-skeleton"
import { useMovieDetails, useWatchlist } from "@/hooks"
import { getImageUrl, getBackdropUrl } from "@/lib/api"
import { formatDate, getMovieTitle, formatNumber } from "@/lib/utils"
import type { Video, MovieDetails, TVShowDetails } from "@/types"

interface DetailPageProps {
    id: number
    type: "movie" | "tv"
}

export function DetailPage({ id, type }: DetailPageProps) {
    const router = useRouter()
    const { details, omdbDetails, isLoading, error } = useMovieDetails(id, type)
    const watchlist = useWatchlist()

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <DetailsSkeleton />
                </div>
            </div>
        )
    }

    if (error || !details) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{type === "movie" ? "Movie" : "TV Show"} Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        {error || `The requested ${type === "movie" ? "movie" : "TV show"} could not be found.`}
                    </p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        )
    }

    const isInWatchlist = watchlist.isInWatchlist(id, type)
    const title = getMovieTitle(details)
    const backdropUrl = getBackdropUrl(details.backdrop_path, "original")
    const posterUrl = getImageUrl(details.poster_path, "w500")

    // Get trailer
    const trailer =
        details.videos?.results?.find((video: Video) => video.type === "Trailer" && video.site === "YouTube") ||
        details.videos?.results?.[0]

    // Get ratings
    const ratings = []
    if (details.vote_average) {
        ratings.push({ source: "TMDB", value: details.vote_average, maxValue: 10 })
    }
    if (omdbDetails?.imdbRating && omdbDetails.imdbRating !== "N/A") {
        ratings.push({ source: "IMDb", value: Number.parseFloat(omdbDetails.imdbRating), maxValue: 10 })
    }
    if (omdbDetails?.Ratings) {
        omdbDetails.Ratings.forEach((rating) => {
            if (rating.Source === "Rotten Tomatoes") {
                ratings.push({
                    source: "Rotten Tomatoes",
                    value: Number.parseInt(rating.Value.replace("%", "")),
                    maxValue: 100,
                })
            }
            if (rating.Source === "Metacritic") {
                ratings.push({
                    source: "Metacritic",
                    value: Number.parseInt(rating.Value.split("/")[0]),
                    maxValue: 100,
                })
            }
        })
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: details.overview,
                    url: window.location.href,
                })
            } catch (error) {
                console.log("Error sharing:", error)
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const handleWatchlistToggle = () => {
        const mediaItem = {
            id: details.id,
            media_type: type,
            ...(type === "movie" ? { title: (details as MovieDetails).title } : { name: (details as TVShowDetails).name }),
            overview: details.overview,
            poster_path: details.poster_path,
            backdrop_path: details.backdrop_path,
            ...(type === "movie"
                ? { release_date: (details as MovieDetails).release_date }
                : { first_air_date: (details as TVShowDetails).first_air_date }),
            vote_average: details.vote_average,
            vote_count: details.vote_count,
            genre_ids: details.genres?.map((g) => g.id) || [],
            adult: details.adult || false,
            popularity: details.popularity || 0,
            original_language: details.original_language || "en",
            ...(type === "tv" && { origin_country: (details as TVShowDetails).origin_country || [] }),
        }
        watchlist.toggleWatchlist(mediaItem as any)
    }

    // Type-specific data
    const movieDetails = type === "movie" ? (details as MovieDetails) : null
    const tvDetails = type === "tv" ? (details as TVShowDetails) : null

    return (
        <div className="min-h-screen">
            
        </div>
    )
}
