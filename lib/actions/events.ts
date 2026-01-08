'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { startOfDay } from "date-fns"

const eventSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
    endDate: z.string().optional(),
    location: z.string().optional(),
    category: z.enum(['KAJIAN', 'SOSIAL', 'PHBI', 'LOMBA', 'LAINNYA']).default('LAINNYA'),
    isPublished: z.boolean().default(false),
})

export type EventFormValues = z.infer<typeof eventSchema>

// Valid Prisma Enum values as string union
type EventCategoryType = 'KAJIAN' | 'SOSIAL' | 'PHBI' | 'LOMBA' | 'LAINNYA'

export async function createEvent(values: EventFormValues) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Anda harus login untuk membuat kegiatan" }
    }

    const validatedFields = eventSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Data tidak valid: " + JSON.stringify(validatedFields.error.flatten()) }
    }

    const { title, description, imageUrl, startDate, endDate, location, category, isPublished } = validatedFields.data

    try {
        const mosque = await prisma.mosque.findFirst()
        if (!mosque) {
            return { error: "Data masjid tidak ditemukan. Harap hubungi admin." }
        }

        await prisma.event.create({
            data: {
                title,
                description,
                imageUrl,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                location,
                category: category as EventCategoryType, // Cast to any to satisfy Prisma if types drift, but runtime is string
                isPublished,
                mosqueId: mosque.id,
                createdBy: session.user.id,
            },
        })

        revalidatePath("/admin/events")
        revalidatePath("/")
        return { success: true }
    } catch (error: any) {
        console.error("Event create error:", error)
        return { error: error.message || "Gagal membuat kegiatan" }
    }
}

export async function getEvents() {
    const mosque = await prisma.mosque.findFirst()
    if (!mosque) return []

    const events = await prisma.event.findMany({
        where: { mosqueId: mosque.id },
        orderBy: { startDate: 'desc' },
        include: { user: true },
    })

    return events
}

export async function getEventById(id: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                mosque: {
                    select: {
                        id: true,
                        name: true,
                        address: true
                    }
                }
            }
        })
        return event
    } catch (error) {
        console.error("Error fetching event by ID:", error)
        return null
    }
}

export async function getPublishedEvents({
    category,
    limit
}: {
    category?: EventCategoryType
    limit?: number
} = {}) {
    console.log("Fetching published events...", { category, limit })
    try {
        const mosque = await prisma.mosque.findFirst()
        if (!mosque) {
            console.log("No mosque found")
            return []
        }

        // Get today's date in UTC to match database timezone
        const todayUTC = new Date()
        todayUTC.setUTCHours(0, 0, 0, 0)

        const events = await prisma.event.findMany({
            where: {
                mosqueId: mosque.id,
                isPublished: true,
                ...(category && { category: category as any }), // Add filter if category is provided
                // Filter events that start from today (UTC) onwards
                startDate: { gte: todayUTC }
            },
            orderBy: { startDate: 'asc' },
            take: limit
        })

        console.log(`Found ${events.length} published events for mosque ${mosque.name}`)
        console.log("Today UTC:", todayUTC.toISOString())
        if (events.length > 0) {
            console.log("Events found:", events.map(e => ({
                title: e.title,
                startDate: e.startDate.toISOString(),
                isPublished: e.isPublished
            })))
        }
        return events
    } catch (error) {
        console.error("Error in getPublishedEvents:", error)
        throw error
    }
}

export async function updateEvent(id: string, values: EventFormValues) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Anda harus login" }
    }

    const validatedFields = eventSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Data tidak valid" }
    }

    const { title, description, imageUrl, startDate, endDate, location, category, isPublished } = validatedFields.data

    try {
        await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                imageUrl,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                location,
                category: category as EventCategoryType,
                isPublished,
            },
        })

        revalidatePath("/admin/events")
        revalidatePath("/")
        return { success: true }
    } catch (error: any) {
        console.error("Event update error:", error)
        return { error: error.message || "Gagal mengupdate kegiatan" }
    }
}

export async function deleteEvent(id: string) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Anda harus login" }
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id },
            select: { imageUrl: true }
        })

        if (event?.imageUrl) {
            const fs = await import('fs/promises')
            const path = await import('path')

            // Remove /uploads/ prefix to get filename
            const filename = event.imageUrl.replace('/uploads/', '')
            const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

            try {
                await fs.unlink(filepath)
            } catch (err) {
                console.error("Failed to delete image file:", err)
                // Continue with event deletion even if file delete fails
            }
        }

        await prisma.event.delete({ where: { id } })
        revalidatePath("/admin/events")
        revalidatePath("/")
        return { success: true }
    } catch (error: any) {
        console.error("Event delete error:", error)
        return { error: error.message || "Gagal menghapus kegiatan" }
    }
}

export async function toggleEventPublish(id: string, isPublished: boolean) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Anda harus login" }
    }

    try {
        await prisma.event.update({
            where: { id },
            data: { isPublished },
        })

        revalidatePath("/admin/events")
        revalidatePath("/")
        return { success: true }
    } catch (error: any) {
        console.error("Event toggle publish error:", error)
        return { error: error.message || "Gagal mengubah status publikasi" }
    }
}

export async function incrementEventView(id: string) {
    try {
        await prisma.event.update({
            where: { id },
            data: { views: { increment: 1 } }
        })
        revalidatePath(`/events/${id}`)
        return { success: true }
    } catch (error) {
        console.error("Increment view error:", error)
        return { success: false }
    }
}

export async function incrementEventLike(id: string) {
    try {
        await prisma.event.update({
            where: { id },
            data: { likes: { increment: 1 } }
        })
        revalidatePath(`/events/${id}`)
        return { success: true }
    } catch (error) {
        console.error("Increment like error:", error)
        return { success: false }
    }
}
