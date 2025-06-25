"use client"

import { use } from "react"
import { DetailPage } from "@/components/movie/detail-page"

interface TVPageProps {
    params: Promise<{ id: string }>
}

export default function TVPage({ params }: TVPageProps) {
    const { id } = use(params)
    const tvId = Number.parseInt(id)

    return <DetailPage id={tvId} type="tv" />
}
