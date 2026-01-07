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

    // DEBUG: Log to file
    try {
        const fs = await import('fs')
        fs.appendFileSync('debug-events.log', `[${new Date().toISOString()}] Page params id: ${id}\n`)
    } catch (e) { }

    const event = await getEventById(id)

    // DEBUG: Log result
    try {
        const fs = await import('fs')
        fs.appendFileSync('debug-events.log', `[${new Date().toISOString()}] Event found: ${!!event}\n`)
    } catch (e) { }

    if (!event) {
        notFound()
    }

    return (
        <EventDetail event={event as any} />
    )
}
