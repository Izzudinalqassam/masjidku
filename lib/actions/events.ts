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
    isPublished: z.boolean().default(false),
})

export type EventFormValues = z.infer<typeof eventSchema>

export async function createEvent(values: EventFormValues) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Anda harus login untuk membuat kegiatan" }
    }

    const validatedFields = eventSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Data tidak valid" }
    }

    const { title, description, imageUrl, startDate, endDate, location, isPublished } = validatedFields.data

    try {
        const mosque = await prisma.mosque.findFirst()
        if (!mosque) {
            return { error: "Data masjid tidak ditemukan" }
        }

        await prisma.event.create({
            data: {
                title,
                description,
                imageUrl,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                location,
                isPublished,
                mosqueId: mosque.id,
                createdBy: session.user.id,
            },
        })

        revalidatePath("/admin/events")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Event create error:", error)
        return { error: "Gagal membuat kegiatan" }
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

export async function getPublishedEvents() {
    console.log("Fetching published events...")
    try {
        const mosque = await prisma.mosque.findFirst()
        if (!mosque) {
            console.log("No mosque found")
            return []
        }

        const events = await prisma.event.findMany({
            where: {
                mosqueId: mosque.id,
                isPublished: true,
                startDate: { gte: startOfDay(new Date()) }
            },
            orderBy: { startDate: 'asc' },
        })

        console.log(`Found ${events.length} published events for mosque ${mosque.name}`)
        return events
    } catch (error) {
        console.error("Error in getPublishedEvents:", error)
        throw error // Re-throw to see the full error in logs
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

    const { title, description, imageUrl, startDate, endDate, location, isPublished } = validatedFields.data

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
                isPublished,
            },
        })

        revalidatePath("/admin/events")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Event update error:", error)
        return { error: "Gagal mengupdate kegiatan" }
    }
}

export async function deleteEvent(id: string) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Anda harus login" }
    }

    try {
        await prisma.event.delete({ where: { id } })
        revalidatePath("/admin/events")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Event delete error:", error)
        return { error: "Gagal menghapus kegiatan" }
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
    } catch (error) {
        console.error("Event toggle publish error:", error)
        return { error: "Gagal mengubah status publikasi" }
    }
}
