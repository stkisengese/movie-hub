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
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh]">
                <Image src={backdropUrl || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Back Button */}
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {/* Share Button */}
                <Button
                    onClick={handleShare}
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                >
                    <Share2 className="h-4 w-4" />
                </Button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Poster */}
                            <div className="flex-shrink-0">
                                <div className="w-40 md:w-48 aspect-poster relative rounded-lg overflow-hidden shadow-2xl">
                                    <Image src={posterUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>

                                {(movieDetails?.tagline || (tvDetails as any)?.tagline) && (
                                    <p className="text-lg md:text-xl text-gray-300 italic mb-4">
                                        {movieDetails?.tagline || (tvDetails as any)?.tagline}
                                    </p>
                                )}

                                {/* Meta info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                                    {(movieDetails?.release_date || tvDetails?.first_air_date) && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(movieDetails?.release_date || tvDetails?.first_air_date || "")}
                                        </div>
                                    )}

                                    {movieDetails?.runtime && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {movieDetails.runtime} min
                                        </div>
                                    )}

                                    {tvDetails?.number_of_seasons && (
                                        <div className="flex items-center gap-1">
                                            <Monitor className="h-4 w-4" />
                                            {tvDetails.number_of_seasons} Season{tvDetails.number_of_seasons !== 1 ? "s" : ""}
                                        </div>
                                    )}

                                    {details.vote_average > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            {details.vote_average.toFixed(1)}
                                        </div>
                                    )}

                                    <span className="bg-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {type === "movie" ? "Movie" : "TV Show"}
                                    </span>
                                </div>

                                {/* Genres */}
                                {details.genres && details.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {details.genres.map((genre) => (
                                            <span key={genre.id} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <Button className="bg-white text-black hover:bg-gray-200">
                                        <Play className="h-4 w-4 mr-2 fill-current" />
                                        {type === "movie" ? "Play Movie" : "Watch Show"}
                                    </Button>

                                    <Button
                                        onClick={handleWatchlistToggle}
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-black"
                                    >
                                        {isInWatchlist ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                In Watchlist
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add to Watchlist
                                            </>
                                        )}
                                    </Button>

                                    {trailer && (
                                        <Button
                                            onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
                                            variant="outline"
                                            className="border-white text-white hover:bg-white hover:text-black"
                                        >
                                            <Play className="h-4 w-4 mr-2" />
                                            Watch Trailer
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
