"use client"

import { CheckSquare, Square, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BulkActionsProps {
    selectedCount: number
    totalCount: number
    onSelectAll: (selected: boolean) => void
    onBulkAction: (action: string) => void
    className?: string
}

export function BulkActions({ selectedCount, totalCount, onSelectAll, onBulkAction, className }: BulkActionsProps) {
    const allSelected = selectedCount === totalCount
    const someSelected = selectedCount > 0 && selectedCount < totalCount

    return (
        <div className={cn("flex items-center justify-between p-4 bg-muted rounded-lg", className)}>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onSelectAll(!allSelected)}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary-600 transition-colors"
                >
                    {allSelected ? (
                        <CheckSquare className="h-4 w-4" />
                    ) : someSelected ? (
                        <div className="h-4 w-4 border-2 border-primary-600 bg-primary-600/50 rounded-sm" />
                    ) : (
                        <Square className="h-4 w-4" />
                    )}
                    {allSelected ? "Deselect All" : "Select All"}
                </button>

                <span className="text-sm text-muted-foreground">
                    {selectedCount} of {totalCount} items selected
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkAction("mark-watched")}
                    className="flex items-center gap-2"
                >
                    <Eye className="h-3 w-3" />
                    Mark Watched
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkAction("mark-unwatched")}
                    className="flex items-center gap-2"
                >
                    <EyeOff className="h-3 w-3" />
                    Mark Unwatched
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkAction("remove")}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="h-3 w-3" />
                    Remove Selected
                </Button>
            </div>
        </div>
    )
}
