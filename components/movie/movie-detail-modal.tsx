"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Play, Plus, Check, Star, Calendar, Clock, Users, ExternalLink, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MultipleRatings } from "@/components/ui/rating-bar"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { Modal, ModalContent } from "@/components/ui/modal"
import { useMovieDetails, useWatchlist } from "@/hooks"
import { getImageUrl, getBackdropUrl } from "@/lib/api"
import { cn, formatDate, formatNumber, formatRuntime } from "@/lib/utils"
import type { MediaItem, Video, MovieDetails } from "@/types"

interface MovieDetailModalProps {
  item: MediaItem | null
  isOpen: boolean
  onClose: () => void
  onPlayClick?: (item: MediaItem) => void
}

export function MovieDetailModal({ item, isOpen, onClose, onPlayClick }: MovieDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "videos" | "similar">("overview")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const movieDetails = useMovieDetails(item?.id || 0, (item?.media_type as "movie" | "tv") || "movie")
  const watchlist = useWatchlist()

  const { details, omdbDetails, isLoading, error } = movieDetails

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview")
      setSelectedVideo(null)
    }
  }, [isOpen])

  if (!item) return null

  const isInWatchlist = watchlist.isInWatchlist(item.id, item.media_type as "movie" | "tv")
  const title = item.title || item.name || "Unknown Title"
  const backdropUrl = getBackdropUrl(item.backdrop_path, "original")
  const posterUrl = getImageUrl(item.poster_path, "w500")

  // Get trailer video
  const trailer =
    details?.videos?.results?.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
    details?.videos?.results?.[0]

  // Get ratings from different sources
  const ratings = []
  if (details?.vote_average) {
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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "cast", label: "Cast & Crew" },
    { id: "videos", label: "Videos" },
    { id: "similar", label: "Similar" },
  ]

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header with backdrop */}
        <div className="relative h-64 md:h-80">
          <Image src={backdropUrl || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="w-32 md:w-40 aspect-poster relative rounded-lg overflow-hidden shadow-2xl">
                  <Image src={posterUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{title}</h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                  {item.release_date || item.first_air_date ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.release_date || item.first_air_date || "")}
                    </div>
                  ) : null}

                  {details && "runtime" in details && details.runtime ? (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatRuntime((details as MovieDetails)?.runtime)}
                    </div>
                  ) : null}

                  {item.vote_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  )}

                  <span className="bg-primary-600 px-2 py-1 rounded text-xs font-medium">
                    {item.media_type === "movie" ? "Movie" : "TV Show"}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => onPlayClick?.(item)} className="bg-white text-black hover:bg-gray-200">
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    Play
                  </Button>

                  <Button
                    onClick={() => watchlist.toggleWatchlist(item)}
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
                      onClick={() => setSelectedVideo(trailer)}
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Trailer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </ModalContent>
    </Modal>
  )
}
