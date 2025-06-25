import type React from "react"
import type { Metadata } from "next"

interface MovieLayoutProps {
    children: React.ReactNode
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params

    return {
        title: `Movie Details | MovieFlix`,
        description: `Detailed information about movie ${id}`,
    }
}

export default function MovieLayout({ children }: MovieLayoutProps) {
    return children
}
