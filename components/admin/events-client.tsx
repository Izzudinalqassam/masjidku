"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Plus, Pencil, Trash2, Eye, EyeOff, CalendarDays, MapPin, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { EventForm } from "./event-form"
import { deleteEvent, toggleEventPublish } from "@/lib/actions/events"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Event {
    id: string
    title: string
    description: string | null
    imageUrl: string | null
    startDate: Date
    endDate: Date | null
    location: string | null
    isPublished: boolean
    createdAt: Date
    user: { fullName: string } | null
}

interface EventsClientProps {
    events: Event[]
}

export function EventsClient({ events }: EventsClientProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const router = useRouter()

    const handleDelete = async (id: string) => {
        const result = await deleteEvent(id)
        if (result.success) {
            toast.success("Kegiatan berhasil dihapus")
            router.refresh()
        } else {
            toast.error(result.error)
        }
    }

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        const result = await toggleEventPublish(id, !currentStatus)
        if (result.success) {
            toast.success(currentStatus ? "Kegiatan disembunyikan" : "Kegiatan dipublikasikan")
            router.refresh()
        } else {
            toast.error(result.error)
        }
    }

    const openEditDialog = (event: Event) => {
        setEditingEvent(event)
        setIsOpen(true)
    }

    const closeDialog = () => {
        setIsOpen(false)
        setEditingEvent(null)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Kegiatan</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Kelola jadwal dan informasi kegiatan masjid.
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setIsOpen(true); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 h-10 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95">
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Kegiatan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingEvent ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}</DialogTitle>
                            <DialogDescription>
                                {editingEvent ? "Ubah informasi kegiatan di bawah ini." : "Isi informasi kegiatan yang akan diadakan."}
                            </DialogDescription>
                        </DialogHeader>
                        <EventForm
                            event={editingEvent}
                            onSuccess={closeDialog}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <CalendarDays className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Belum Ada Kegiatan</h3>
                        <p className="text-sm text-muted-foreground mt-1">Mulai tambahkan kegiatan masjid untuk ditampilkan.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/80">
                                <TableHead className="w-20">Gambar</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Lokasi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id} className="group hover:bg-gray-50/50">
                                    <TableCell>
                                        {event.imageUrl ? (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="w-16 h-12 object-cover rounded-lg border"
                                            />
                                        ) : (
                                            <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-gray-900">{event.title}</div>
                                        {event.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{event.description}</p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <CalendarDays className="w-4 h-4 text-gray-400" />
                                            <span>{format(new Date(event.startDate), "dd MMM yyyy", { locale: id })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {event.location ? (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="truncate max-w-[150px]">{event.location}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={event.isPublished ? "default" : "secondary"} className={event.isPublished ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                                            {event.isPublished ? "Publik" : "Draf"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleTogglePublish(event.id, event.isPublished)}
                                                title={event.isPublished ? "Sembunyikan" : "Publikasikan"}
                                            >
                                                {event.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => openEditDialog(event)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tindakan ini tidak dapat dibatalkan. Kegiatan "{event.title}" akan dihapus secara permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(event.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
