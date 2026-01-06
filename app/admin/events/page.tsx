import { getEvents } from "@/lib/actions/events"
import { EventsClient } from "@/components/admin/events-client"

export default async function EventsPage() {
    const events = await getEvents()

    return (
        <div className="container mx-auto py-8 px-4 md:px-0">
            <EventsClient events={events as any} />
        </div>
    )
}
