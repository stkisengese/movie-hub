import { DetailsSkeleton } from "@/components/ui/loading-skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <DetailsSkeleton />
            </div>
        </div>
    )
}
