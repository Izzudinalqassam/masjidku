import { getPublishedEvents } from "@/lib/actions/events"
import { prisma } from "@/lib/prisma"
import { LandingPage } from "@/components/public/landing-page"

export const dynamic = "force-dynamic"

export default async function Home() {
  const events = await getPublishedEvents()
  const mosque = await prisma.mosque.findFirst()

  return (
    <LandingPage
      events={events as any}
      mosqueName={mosque?.name || "Masjid Al-Ikhlas"}
      mosqueAddress={mosque?.address || ""}
    />
  )
}
