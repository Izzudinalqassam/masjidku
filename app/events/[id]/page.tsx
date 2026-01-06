import { getEventById } from "@/lib/actions/events"
import { EventDetail } from "@/components/public/event-detail"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface EventPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const { id } = await params
    const event = await getEventById(id)
    if (!event) return { title: "Kegiatan Tidak Ditemukan" }

    return {
        title: `${event.title} - ${event.mosque.name}`,
        description: event.description || "Detail kegiatan masjid",
    }
}

export default async function EventPage({ params }: EventPageProps) {
    const { id } = await params
    const event = await getEventById(id)

    if (!event) {
        notFound()
    }

    return (
        <EventDetail event={event as any} />
    )
}
