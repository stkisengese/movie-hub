"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Film, Monitor, Star, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stat {
    id: string
    label: string
    value: number
    icon: React.ReactNode
    suffix?: string
    color: string
}

interface StatsSectionProps {
    className?: string
}

const stats: Stat[] = [
    {
        id: "movies",
        label: "Movies Available",
        value: 50000,
        icon: <Film className="h-8 w-8" />,
        suffix: "+",
        color: "text-red-500",
    },
    {
        id: "tv-shows",
        label: "TV Shows",
        value: 15000,
        icon: <Monitor className="h-8 w-8" />,
        suffix: "+",
        color: "text-blue-500",
    },
    {
        id: "rating",
        label: "Average Rating",
        value: 8.5,
        icon: <Star className="h-8 w-8" />,
        color: "text-yellow-500",
    },
    {
        id: "users",
        label: "Happy Users",
        value: 100000,
        icon: <Users className="h-8 w-8" />,
        suffix: "+",
        color: "text-green-500",
    },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const duration = 2000 // 2 seconds
        const steps = 60
        const increment = value / steps
        const stepDuration = duration / steps

        let currentStep = 0
        const timer = setInterval(() => {
            currentStep++
            setCount(Math.min(increment * currentStep, value))

            if (currentStep >= steps) {
                clearInterval(timer)
                setCount(value)
            }
        }, stepDuration)

        return () => clearInterval(timer)
    }, [value])

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M"
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K"
        }
        return num.toFixed(num % 1 === 0 ? 0 : 1)
    }

    return (
        <span className="font-bold text-3xl md:text-4xl">
            {formatNumber(count)}
            {suffix}
        </span>
    )
}

export function StatsSection({ className }: StatsSectionProps) {
    return (
        <section
            className={cn(
                "py-16 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950",
                className,
            )}
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">MovieFlix by the Numbers</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join millions of users discovering their next favorite movie or TV show
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border hover:shadow-lg transition-shadow"
                        >
                            <div className={cn("inline-flex p-4 rounded-full bg-background mb-4", stat.color)}>{stat.icon}</div>
                            <div className="space-y-2">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
