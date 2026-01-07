"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, ImageIcon, Loader2, Upload, X, Clock, MapPin, Users, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { createEvent, updateEvent, type EventFormValues } from "@/lib/actions/events"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    startDate: z.date({ message: "Tanggal mulai wajib diisi" }),
    endDate: z.date().optional().nullable(),
    location: z.string().optional(),
    category: z.enum(['KAJIAN', 'SOSIAL', 'PHBI', 'LOMBA', 'LAINNYA']),
    isPublished: z.boolean(),
    // Reminder fields
    reminderTime: z.string().optional(),
    reminderEnabled: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

// Define a local type compatible with the Prisma enum string union
type EventCategoryType = 'KAJIAN' | 'SOSIAL' | 'PHBI' | 'LOMBA' | 'LAINNYA'

interface EventFormProps {
    event?: {
        id: string
        title: string
        description: string | null
        imageUrl: string | null
        startDate: Date
        endDate: Date | null
        location: string | null
        category: EventCategoryType | string // Allow string to be safe
        isPublished: boolean
    } | null
    onSuccess?: () => void
}

export function EventForm({ event, onSuccess }: EventFormProps) {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            imageUrl: "",
            startDate: undefined,
            endDate: undefined,
            location: "",
            category: "LAINNYA",
            isPublished: false,
            reminderEnabled: false,
            reminderTime: "15",
        },
    })

    // Initialize form with event data after mount
    useEffect(() => {
        if (event && mounted) {
            form.reset({
                title: event.title || "",
                description: event.description || "",
                imageUrl: event.imageUrl || "",
                startDate: event.startDate ? new Date(event.startDate) : undefined,
                endDate: event.endDate ? new Date(event.endDate) : undefined,
                location: event.location || "",
                category: (event.category as EventCategoryType) || "LAINNYA",
                isPublished: event.isPublished || false,
                reminderEnabled: false,
                reminderTime: "15",
            })
            setPreviewImage(event.imageUrl || null)
        }
        setMounted(true)
    }, [event, mounted, form])

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleImageUrlChange = (url: string) => {
        setPreviewImage(url || null)
    }

    // Handle date selection for start date
    const handleStartDateSelect = (date: Date | undefined, field: any) => {
        if (date) {
            const current = field.value || new Date()
            const newDate = new Date(date)
            newDate.setHours(current.getHours() || 0, current.getMinutes() || 0)
            field.onChange(newDate)
        }
    }

    // Handle time input for start date
    const handleStartTimeChange = (time: string, field: any) => {
        if (time && field.value) {
            const [hours, minutes] = time.split(':').map(Number)
            const newDate = new Date(field.value)
            newDate.setHours(hours, minutes)
            field.onChange(newDate)
        } else if (time) {
            // If no date exists yet, create one with today's date
            const today = new Date()
            const [hours, minutes] = time.split(':').map(Number)
            const newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
            field.onChange(newDate)
        }
    }

    // Handle date selection for end date
    const handleEndDateSelect = (date: Date | undefined, field: any) => {
        if (date) {
            const current = field.value || new Date()
            const newDate = new Date(date)
            newDate.setHours(current.getHours() || 0, current.getMinutes() || 0)
            field.onChange(newDate)
        } else {
            field.onChange(null)
        }
    }

    // Handle time input for end date
    const handleEndTimeChange = (time: string, field: any) => {
        if (time && field.value) {
            const [hours, minutes] = time.split(':').map(Number)
            const newDate = new Date(field.value)
            newDate.setHours(hours, minutes)
            field.onChange(newDate)
        } else if (time) {
            // If no date exists yet, create one with today's date
            const today = new Date()
            const [hours, minutes] = time.split(':').map(Number)
            const newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
            field.onChange(newDate)
        }
    }

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)

        const payload: EventFormValues = {
            title: values.title,
            description: values.description,
            imageUrl: values.imageUrl,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate ? values.endDate.toISOString() : undefined,
            location: values.location,
            category: values.category,
            isPublished: values.isPublished,
        }

        const result = event
            ? await updateEvent(event.id, payload)
            : await createEvent(payload)

        setIsSubmitting(false)

        if (result.success) {
            toast.success(event ? "Kegiatan berhasil diperbarui" : "Kegiatan berhasil ditambahkan")
            router.refresh()
            onSuccess?.()
        } else {
            toast.error(result.error)
        }
    }

    if (!mounted) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gambar Kegiatan</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                className="hidden"
                                                id="image-upload"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0]
                                                    if (!file) return

                                                    // Show loading preview
                                                    setIsUploading(true)

                                                    try {
                                                        const formData = new FormData()
                                                        formData.append('file', file)

                                                        const res = await fetch('/api/upload', {
                                                            method: 'POST',
                                                            body: formData,
                                                        })

                                                        const data = await res.json()

                                                        if (data.success) {
                                                            field.onChange(data.url)
                                                            setPreviewImage(data.url)
                                                            toast.success('Gambar berhasil diupload')
                                                        } else {
                                                            toast.error(data.error || 'Upload gagal')
                                                        }
                                                    } catch (error) {
                                                        toast.error('Upload gagal')
                                                    } finally {
                                                        setIsUploading(false)
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className={cn(
                                                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                                                    "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50",
                                                    isUploading && "opacity-50 pointer-events-none"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                                                        <span className="text-sm text-gray-600">Mengupload...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-5 h-5 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Pilih gambar dari komputer</span>
                                                    </>
                                                )}
                                            </label>
                                            {field.value && (
                                                <p className="text-xs text-muted-foreground truncate">
                                                    File: {field.value}
                                                </p>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Format: JPEG, PNG, WebP, GIF (Maks. 5MB)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Preview */}
                        {previewImage ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={() => setPreviewImage(null)}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(null)
                                        form.setValue('imageUrl', '')
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50">
                                <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                                <p className="text-sm text-muted-foreground">Preview gambar akan muncul di sini</p>
                            </div>
                        )}
                    </div>

                    {/* Event Information Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Kegiatan</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Kajian Rutin Ahad Pagi" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Jelaskan detail kegiatan..."
                                                className="min-h-[100px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Category */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="KAJIAN">Kajian</SelectItem>
                                                <SelectItem value="SOSIAL">Sosial</SelectItem>
                                                <SelectItem value="PHBI">PHBI (Hari Besar)</SelectItem>
                                                <SelectItem value="LOMBA">Lomba</SelectItem>
                                                <SelectItem value="LAINNYA">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Kategori kegiatan untuk memudahkan pencarian
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Location */}
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Lokasi
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Aula Utama Masjid" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Lokasi spesifik kegiatan akan dilaksanakan
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Date & Time Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-sm font-semibold text-gray-900">Waktu Pelaksanaan</h3>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Tanggal & Waktu Mulai</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "dd MMMM yyyy HH:mm", { locale: id })
                                                            ) : (
                                                                <span>Pilih tanggal dan waktu</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => handleStartDateSelect(date, field)}
                                                        locale={id}
                                                        weekStartsOn={1}
                                                    />
                                                    <div className="p-3 border-t">
                                                        <label className="text-xs font-medium text-gray-700">Waktu:</label>
                                                        <Input
                                                            type="time"
                                                            value={field.value ? format(field.value, "HH:mm") : ""}
                                                            onChange={(e) => handleStartTimeChange(e.target.value, field)}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Waktu dimulainya kegiatan
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Tanggal & Waktu Selesai (Opsional)</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "dd MMMM yyyy HH:mm", { locale: id })
                                                            ) : (
                                                                <span>Tidak ada waktu selesai</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value || undefined}
                                                        onSelect={(date) => handleEndDateSelect(date, field)}
                                                        locale={id}
                                                        weekStartsOn={1}
                                                    />
                                                    <div className="p-3 border-t">
                                                        <label className="text-xs font-medium text-gray-700">Waktu:</label>
                                                        <Input
                                                            type="time"
                                                            value={field.value ? format(field.value, "HH:mm") : ""}
                                                            onChange={(e) => handleEndTimeChange(e.target.value, field)}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Kosongkan jika kegiatan tidak memiliki waktu selesai spesifik
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Reminder Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bell className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-sm font-semibold text-gray-900">Pengingat</h3>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="reminderEnabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-gray-50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm font-medium">Aktifkan Pengingat</FormLabel>
                                                <FormDescription>
                                                    Kirim notifikasi pengingat sebelum kegiatan dimulai
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {form.watch("reminderEnabled") && (
                                    <FormField
                                        control={form.control}
                                        name="reminderTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Waktu Pengingat</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            max="120"
                                                            {...field}
                                                            className="w-20"
                                                        />
                                                        <span className="text-sm text-gray-600">menit sebelumnya</span>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Notifikasi akan dikirim beberapa menit sebelum kegiatan dimulai
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Publish Toggle */}
                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Publikasikan
                                    </FormLabel>
                                    <FormDescription>
                                        Kegiatan akan tampil di halaman depan dan dapat diakses oleh jamaah.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {event ? "Simpan Perubahan" : "Tambah Kegiatan"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div >
    )
}
