"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            const reset = () => {
                this.setState({ hasError: false, error: undefined })
            }

            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback
                return <FallbackComponent error={this.state.error} reset={reset} />
            }

            return <DefaultErrorFallback error={this.state.error} reset={reset} />
        }

        return this.props.children
    }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                {error?.message || "An unexpected error occurred. Please try again."}
            </p>
            <Button onClick={reset} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
            </Button>
        </div>
    )
}

export function ErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
    return <DefaultErrorFallback error={error} reset={reset} />
}
