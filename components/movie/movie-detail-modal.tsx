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
                      {formatRuntime(details.runtime!)}
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

        {/* Content */}
        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 font-medium text-sm border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {isLoading ? (
              <div className="space-y-4">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-4 w-1/2" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Failed to load details: {error}</p>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Synopsis */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Synopsis</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {(details as any)?.overview || item.overview || "No synopsis available."}
                      </p>
                    </div>

                    {/* Ratings */}
                    {ratings.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Ratings</h3>
                        <MultipleRatings ratings={ratings} />
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {details?.genres && details.genres.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Genres</h4>
                            <div className="flex flex-wrap gap-2">
                              {details.genres.map((genre) => (
                                <span key={genre.id} className="bg-muted px-3 py-1 rounded-full text-sm">
                                  {genre.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {details && "production_companies" in details && details.production_companies && (
                          <div>
                            <h4 className="font-medium mb-2">Production</h4>
                            <p className="text-sm text-muted-foreground">
                              {details.production_companies.map((company) => company.name).join(", ")}
                            </p>
                          </div>
                        )}

                        {omdbDetails?.Director && (
                          <div>
                            <h4 className="font-medium mb-2">Director</h4>
                            <p className="text-sm text-muted-foreground">{omdbDetails.Director}</p>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {omdbDetails?.Writer && (
                          <div>
                            <h4 className="font-medium mb-2">Writers</h4>
                            <p className="text-sm text-muted-foreground">{omdbDetails.Writer}</p>
                          </div>
                        )}

                        {details &&
                          "budget" in details && details.budget! > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Budget</h4>
                              <p className="text-sm text-muted-foreground">
                                ${formatNumber(details.budget!)}
                              </p>
                            </div>
                          )}

                        {details &&
                          "revenue" in details && details.revenue! > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Box Office</h4>
                              <p className="text-sm text-muted-foreground">
                                ${formatNumber(details.revenue!)}
                              </p>
                            </div>
                          )}

                        {omdbDetails?.Awards && omdbDetails.Awards !== "N/A" && (
                          <div>
                            <h4 className="font-medium mb-2">Awards</h4>
                            <p className="text-sm text-muted-foreground">{omdbDetails.Awards}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* External Links */}
                    {details?.external_ids && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">External Links</h3>
                        <div className="flex gap-3">
                          {details.external_ids.imdb_id && (
                            <a
                              href={`https://www.imdb.com/title/${details.external_ids.imdb_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                              IMDb
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cast Tab */}
                {activeTab === "cast" && (
                  <div className="space-y-6">
                    {details?.credits?.cast && details.credits.cast.length > 0 ? (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Cast</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {details.credits.cast.slice(0, 12).map((person) => (
                              <div key={person.id} className="text-center">
                                <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-muted">
                                  {person.profile_path ? (
                                    <Image
                                      src={getImageUrl(person.profile_path, "w185") || "/placeholder.svg"}
                                      alt={person.name}
                                      width={80}
                                      height={80}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Users className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <p className="font-medium text-sm">{person.name}</p>
                                <p className="text-xs text-muted-foreground">{person.character}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {details.credits.crew && details.credits.crew.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Key Crew</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {details.credits.crew
                                .filter((person) =>
                                  ["Director", "Producer", "Executive Producer", "Screenplay", "Writer"].includes(
                                    person.job,
                                  ),
                                )
                                .slice(0, 8)
                                .map((person) => (
                                  <div key={`${person.id}-${person.job}`} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                      {person.profile_path ? (
                                        <Image
                                          src={getImageUrl(person.profile_path, "w185") || "/placeholder.svg"}
                                          alt={person.name}
                                          width={48}
                                          height={48}
                                          className="object-cover w-full h-full"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Users className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{person.name}</p>
                                      <p className="text-xs text-muted-foreground">{person.job}</p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Cast information not available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === "videos" && (
                  <div>
                    {details?.videos?.results && details.videos.results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {details.videos.results.slice(0, 6).map((video) => (
                          <div
                            key={video.id}
                            className="bg-muted rounded-lg p-4 cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => setSelectedVideo(video)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                                <Play className="h-5 w-5 text-white fill-current" />
                              </div>
                              <div>
                                <p className="font-medium">{video.name}</p>
                                <p className="text-sm text-muted-foreground">{video.type}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No videos available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Similar Tab */}
                {activeTab === "similar" && (
                  <div>
                    {details?.similar?.results && details.similar.results.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {details.similar.results.slice(0, 8).map((similarItem) => {
                          // Convert to MediaItem-like structure for consistent access
                          const mediaItem = {
                            ...similarItem,
                            media_type: item?.media_type || "movie",
                            title: (similarItem as any).title,
                            name: (similarItem as any).name,
                            release_date: (similarItem as any).release_date,
                            first_air_date: (similarItem as any).first_air_date,
                          }

                          const title = mediaItem.title || mediaItem.name || "Unknown Title"
                          const year =
                            mediaItem.release_date || mediaItem.first_air_date
                              ? new Date(mediaItem.release_date || mediaItem.first_air_date || "").getFullYear()
                              : ""

                          return (
                            <div key={similarItem.id} className="group cursor-pointer">
                              <div className="aspect-poster rounded-lg overflow-hidden mb-2">
                                <Image
                                  src={getImageUrl(similarItem.poster_path, "w342") || "/placeholder.svg"}
                                  alt={title}
                                  width={200}
                                  height={300}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <p className="font-medium text-sm line-clamp-2">{title}</p>
                              <p className="text-xs text-muted-foreground">{year}</p>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No similar content found</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl aspect-video">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                title={selectedVideo.name}
                className="w-full h-full rounded-lg"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}
