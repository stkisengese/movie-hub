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

           
        </div>
    )
}
