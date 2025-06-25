"use client"

import { use } from "react"
import { DetailPage } from "@/components/movie/detail-page"

interface MoviePageProps {
    params: Promise<{ id: string }>
}

export default function MoviePage({ params }: MoviePageProps) {
    const { id } = use(params)
    const movieId = Number.parseInt(id)

    return <DetailPage id={movieId} type="movie" />
}
