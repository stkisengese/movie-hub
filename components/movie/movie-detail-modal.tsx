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
        
      </ModalContent>
    </Modal>
  )
}
