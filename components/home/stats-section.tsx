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
