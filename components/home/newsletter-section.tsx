"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NewsletterSectionProps {
    className?: string
}

export function NewsletterSection({ className }: NewsletterSectionProps) {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !email.includes("@")) {
            setStatus("error")
            setMessage("Please enter a valid email address")
            return
        }

        setStatus("loading")

        // Simulate API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setStatus("success")
            setMessage("Thank you for subscribing! Check your email for confirmation.")
            setEmail("")
        } catch (error) {
            setStatus("error")
            setMessage("Something went wrong. Please try again.")
        }
    }

    return (
        <section className={cn("py-16 bg-gradient-to-r from-primary-600 to-secondary-600", className)}>
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center text-white">
                    <Mail className="h-16 w-16 mx-auto mb-6 opacity-90" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Get notified about the latest movies, TV shows, and exclusive content recommendations delivered straight to
                        your inbox.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <div className="flex-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                disabled={status === "loading"}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-6 py-3 disabled:opacity-50"
                        >
                            {status === "loading" ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                    Subscribing...
                                </div>
                            ) : status === "success" ? (
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    Subscribed!
                                </div>
                            ) : (
                                "Subscribe"
                            )}
                        </Button>
                    </form>

                    {message && (
                        <div
                            className={cn(
                                "mt-4 p-3 rounded-lg flex items-center gap-2 text-sm",
                                status === "success" ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100",
                            )}
                        >
                            {status === "success" ? (
                                <Check className="h-4 w-4 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            )}
                            {message}
                        </div>
                    )}

                    <p className="text-xs mt-4 opacity-75">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </section>
    )
}
