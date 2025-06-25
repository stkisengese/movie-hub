"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Calendar, Eye, EyeOff, Trash2, Edit3, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { WatchlistItem as WatchlistItemType } from "@/types"

interface WatchlistItemProps {
    item: WatchlistItemType
    isSelected: boolean
    onSelect: (selected: boolean) => void
    onItemClick: () => void
    onToggleWatched: () => void
    onRemove: () => void
    onUpdateRating: (rating: number) => void
    onUpdateNotes: (notes: string) => void
    className?: string
}

export function WatchlistItem({
    item,
    isSelected,
    onSelect,
    onItemClick,
    onToggleWatched,
    onRemove,
    onUpdateRating,
    onUpdateNotes,
    className,
}: WatchlistItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editRating, setEditRating] = useState(item.rating || 0)
    const [editNotes, setEditNotes] = useState(item.notes || "")

    const handleSave = () => {
        onUpdateRating(editRating)
        onUpdateNotes(editNotes)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditRating(item.rating || 0)
        setEditNotes(item.notes || "")
        setIsEditing(false)
    }

    return (
        <div
            className={cn(
                "flex gap-4 p-4 bg-card rounded-lg border transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary-500",
                className,
            )}
        >
            {/* Selection Checkbox */}
            <div className="flex-shrink-0 pt-1">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
            </div>

            {/* Poster */}
            <div className="flex-shrink-0">
                <div
                    className="w-16 h-24 rounded overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onItemClick}
                >
                    <Image
                        src={getImageUrl(item.poster_path, "w154") || "/placeholder.svg"}
                        alt={item.title}
                        width={64}
                        height={96}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-semibold text-lg cursor-pointer hover:text-primary-600 transition-colors line-clamp-1"
                            onClick={onItemClick}
                        >
                            {item.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="capitalize">{item.type}</span>
                            {item.release_date && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(item.release_date)}
                                </div>
                            )}
                            {item.vote_average > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {item.vote_average.toFixed(1)}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 mt-2">
                            <span
                                className={cn(
                                    "px-2 py-1 rounded-full text-xs font-medium",
                                    item.watched
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                                )}
                            >
                                {item.watched ? "Watched" : "Unwatched"}
                            </span>
                            {item.watched && item.watchedAt && (
                                <span className="text-xs text-muted-foreground">on {formatDate(item.watchedAt)}</span>
                            )}
                        </div>

                        

                        <div className="text-xs text-muted-foreground mt-2">Added {formatDate(item.addedAt)}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={onToggleWatched} className="flex items-center gap-2">
                            {item.watched ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            {item.watched ? "Mark Unwatched" : "Mark Watched"}
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2"
                        >
                            <Edit3 className="h-3 w-3" />
                            {isEditing ? "Cancel" : "Edit"}
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onRemove}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-3 w-3" />
                            Remove
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
