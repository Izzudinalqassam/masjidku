"use client"

import { useState } from "react"
import { Mosque } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Building2, Save, Wallet, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { updateMosqueSettings, resetDatabase } from "@/lib/actions/settings"
import { settingsSchema, type SettingsValues } from "@/lib/validations/settings"
import { AlertTriangle, Trash2 } from "lucide-react"
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

function ResetButton() {
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("")

    async function handleReset() {
        if (!password) {
            toast.error("Silakan masukkan password konfirmasi")
            return
        }

        setIsLoading(true)
        try {
            const result = await resetDatabase(password)
            if (result.success) {
                toast.success("Data transaksi berhasil dibersihkan")
                window.location.reload()
            } else {
                toast.error(result.error || "Gagal mereset data")
            }
        } catch (e) {
            toast.error("Terjadi kesalahan")
        } finally {
            setIsLoading(false)
            setPassword("")
        }
    }

    return (
        <AlertDialog onOpenChange={(open) => !open && setPassword("")}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                        <p>
                            Tindakan ini akan menghapus <strong>SEMUA TRANSAKSI</strong> dari database secara permanen.
                            Data yang dihapus tidak dapat dikembalikan.
                        </p>
                        <div className="pt-2">
                            <Label htmlFor="reset-password">Masukkan Password Anda untuk Konfirmasi</Label>
                            <Input
                                id="reset-password"
                                type="password"
                                placeholder="Password Akun Anda"
                                className="mt-1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleReset()
                        }}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isLoading || !password}
                    >
                        {isLoading ? "Memproses..." : "Ya, Hapus Semua Data"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


interface SerializedMosque {
    id: string
    name: string
    address: string | null
    phone: string | null
    email: string | null
    openingBalance: number
    openingDate: Date
    createdAt: Date
    updatedAt: Date
}

interface SettingsFormProps {
    mosque: SerializedMosque
}

export function SettingsForm({ mosque }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<SettingsValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: mosque.name,
            address: mosque.address || "",
            phone: mosque.phone || "",
            email: mosque.email || "",
            openingBalance: Number(mosque.openingBalance),
            openingDate: new Date(mosque.openingDate),
        },
    })

    async function onSubmit(values: SettingsValues) {
        setIsLoading(true)
        try {
            const result = await updateMosqueSettings(values)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Pengaturan berhasil disimpan")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="profile">Profil Masjid</TabsTrigger>
                <TabsTrigger value="finance">Keuangan</TabsTrigger>
            </TabsList>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profil Masjid</CardTitle>
                                <CardDescription>
                                    Informasi umum identitas masjid yang akan muncul di laporan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Masjid</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="Contoh: Masjid Al-Ikhlas" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alamat Lengkap</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Jalan..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Telepon / WA</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="08..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="info@masjid.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50/50 border-t px-6 py-4">
                                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Simpan Perubahan
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="finance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Konfigurasi Keuangan</CardTitle>
                                <CardDescription>
                                    Pengaturan dasar untuk perhitungan dan pelaporan keuangan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="openingBalance"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Saldo Awal (Opening Balance)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-sm font-semibold text-gray-500">Rp</span>
                                                        <Input
                                                            type="number"
                                                            className="pl-9"
                                                            placeholder="0"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Saldo kas saat sistem ini pertama kali digunakan.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="openingDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Tanggal Mulai Pembukuan</FormLabel>
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
                                                                    format(field.value, "d MMMM yyyy", { locale: id })
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
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>
                                                    Tanggal referensi untuk perhitungan saldo awal.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50/50 border-t px-6 py-4">
                                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Simpan Konfigurasi
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-red-100 mt-6">
                            <CardHeader>
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                <CardDescription>
                                    Tindakan di bawah ini tidak dapat dibatalkan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50/50 rounded-lg">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-red-900">Reset System Data</h4>
                                        <p className="text-sm text-red-700">
                                            Hapus semua transaksi dan kembalikan saldo ke 0. User dan Pengaturan Masjid tidak akan dihapus.
                                        </p>
                                    </div>
                                    <ResetButton />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </form>
            </Form>
        </Tabs >
    )
}
