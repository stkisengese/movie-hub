import type React from "react"
import type { Metadata } from "next"

interface TVLayoutProps {
    children: React.ReactNode
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params

    return {
        title: `TV Show Details | MovieFlix`,
        description: `Detailed information about TV show ${id}`,
    }
}

export default function TVLayout({ children }: TVLayoutProps) {
    return children
}
