"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <h3 className="text-xl font-medium mb-2">{title}</h3>
            {description && <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>}
            {action && (
                <Button onClick={action.onClick} variant="outline">
                    {action.label}
                </Button>
            )}
        </div>
    )
}
