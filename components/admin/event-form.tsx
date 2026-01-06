"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, ImageIcon, Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createEvent, updateEvent, EventFormValues } from "@/lib/actions/events"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    startDate: z.date({ message: "Tanggal mulai wajib diisi" }),
    endDate: z.date().optional().nullable(),
    location: z.string().optional(),
    isPublished: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface EventFormProps {
    event?: {
        id: string
        title: string
        description: string | null
        imageUrl: string | null
        startDate: Date
        endDate: Date | null
        location: string | null
        isPublished: boolean
    } | null
    onSuccess?: () => void
}

export function EventForm({ event, onSuccess }: EventFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(event?.imageUrl || null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: event?.title || "",
            description: event?.description || "",
            imageUrl: event?.imageUrl || "",
            startDate: event?.startDate ? new Date(event.startDate) : undefined,
            endDate: event?.endDate ? new Date(event.endDate) : undefined,
            location: event?.location || "",
            isPublished: event?.isPublished || false,
        },
    })

    const handleImageUrlChange = (url: string) => {
        setPreviewImage(url || null)
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

    return (
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

                {/* Date Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Mulai</FormLabel>
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
                                                    format(field.value, "dd MMMM yyyy", { locale: id })
                                                ) : (
                                                    <span>Pilih tanggal</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            locale={id}
                                            weekStartsOn={1}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Selesai (Opsional)</FormLabel>
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
                                                    format(field.value, "dd MMMM yyyy", { locale: id })
                                                ) : (
                                                    <span>Pilih tanggal</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            locale={id}
                                            weekStartsOn={1}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Location */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lokasi</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: Aula Utama Masjid" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Publish Toggle */}
                <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50/50">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Publikasikan</FormLabel>
                                <FormDescription>
                                    Kegiatan akan tampil di halaman depan.
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
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {event ? "Simpan Perubahan" : "Tambah Kegiatan"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
