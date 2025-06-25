"use client"

import { Clock, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchHistoryItem {
    query: string
    timestamp: string
    resultsCount: number
}

interface SearchHistoryProps {
    history: SearchHistoryItem[]
    onSearchClick: (query: string) => void
    onClearHistory: () => void
    className?: string
}

export function SearchHistory({ history, onSearchClick, onClearHistory, className }: SearchHistoryProps) {
    if (history.length === 0) {
        return (
            <div className={cn("text-center py-8", className)}>
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Your Search</h3>
                <p className="text-muted-foreground">Search for movies, TV shows, or actors to get started</p>
            </div>
        )
    }

    return (
        <div className={cn("", className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Recent Searches</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearHistory}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => onSearchClick(item.query)}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border hover:bg-muted transition-colors text-left group"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate group-hover:text-primary-600 transition-colors">{item.query}</p>
                                <p className="text-xs text-muted-foreground">{item.resultsCount.toLocaleString()} results</p>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}
