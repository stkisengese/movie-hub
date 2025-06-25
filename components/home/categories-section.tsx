"use client"

import type React from "react"

import { useState } from "react"
import { Film, Monitor, Star, Calendar, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Category {
    id: string
    name: string
    icon: React.ReactNode
    description: string
    color: string
}

interface CategoriesSectionProps {
    onCategoryClick?: (categoryId: string) => void
    className?: string
}

const categories: Category[] = [
    {
        id: "trending-movies",
        name: "Trending Movies",
        icon: <TrendingUp className="h-6 w-6" />,
        description: "Most popular movies right now",
        color: "from-red-500 to-pink-500",
    },
    {
        id: "trending-tv",
        name: "Trending TV Shows",
        icon: <Monitor className="h-6 w-6" />,
        description: "Hottest TV series everyone's watching",
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: "top-rated-movies",
        name: "Top Rated Movies",
        icon: <Star className="h-6 w-6" />,
        description: "Highest rated films of all time",
        color: "from-yellow-500 to-orange-500",
    },
    {
        id: "top-rated-tv",
        name: "Top Rated TV Shows",
        icon: <Award className="h-6 w-6" />,
        description: "Best TV series according to critics",
        color: "from-green-500 to-emerald-500",
    },
    {
        id: "new-releases",
        name: "New Releases",
        icon: <Calendar className="h-6 w-6" />,
        description: "Latest movies and shows",
        color: "from-purple-500 to-violet-500",
    },
    {
        id: "classic-movies",
        name: "Classic Movies",
        icon: <Film className="h-6 w-6" />,
        description: "Timeless cinema masterpieces",
        color: "from-gray-600 to-gray-800",
    },
]

export function CategoriesSection({ onCategoryClick, className }: CategoriesSectionProps) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

    return (
        <section className={cn("py-12 bg-muted/30", className)}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Categories</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover content tailored to your interests across different genres and categories
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={cn(
                                "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer",
                                hoveredCategory === category.id && "ring-2 ring-primary-500",
                            )}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => onCategoryClick?.(category.id)}
                        >
                            {/* Background Gradient */}
                            <div
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity",
                                    category.color,
                                )}
                            />

                            <div className="relative p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={cn("p-3 rounded-lg bg-gradient-to-br text-white", category.color)}>
                                        {category.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold group-hover:text-primary-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{category.description}</p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-left group-hover:bg-primary-50 group-hover:text-primary-700 dark:group-hover:bg-primary-950 dark:group-hover:text-primary-300"
                                >
                                    Explore {category.name}
                                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
