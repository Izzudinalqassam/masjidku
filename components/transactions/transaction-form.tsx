"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import {
    CalendarIcon, Loader2, Wallet,
    HandCoins,
    Landmark,
    Briefcase,
    ShoppingCart,
    Lightbulb,
    Wrench,
    Heart,
    Utensils,
    Bus,
    GraduationCap,
    Zap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { transactionSchema } from "@/lib/validations"
import { createTransaction } from "@/lib/actions/transactions"
import { Category } from "@prisma/client"

// Helper for icons
const CategoryIcon = ({ iconName }: { iconName?: string }) => {
    const icons: Record<string, any> = {
        wallet: Wallet,
        'hand-coins': HandCoins,
        landmark: Landmark,
        briefcase: Briefcase,
        shopping: ShoppingCart,
        lightbulb: Lightbulb,
        wrench: Wrench,
        heart: Heart,
        food: Utensils,
        transport: Bus,
        education: GraduationCap,
        energy: Zap,
        settings: Wrench // Fallback/Alias
    }

    const Icon = icons[iconName || 'wallet'] || Wallet
    return <Icon className="w-5 h-5" />
}

interface TransactionFormProps {
    categories: Category[]
    onSuccess?: () => void
}

export function TransactionForm({ categories, onSuccess }: TransactionFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof transactionSchema>>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "INCOME",
            amount: 0,
            description: "",
            transactionDate: new Date(),
        },
    })

    const type = form.watch("type")
    const filteredCategories = categories.filter((c) => c.type === type)

    async function onSubmit(values: z.infer<typeof transactionSchema>) {
        setIsLoading(true)
        setServerError(null)

        try {
            const result = await createTransaction(values)

            if (result.error) {
                setServerError(result.error)
                toast.error("Gagal Menyimpan", {
                    description: result.error
                })
            } else {
                toast.success("Transaksi Berhasil Disimpan", {
                    description: `${values.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'} sebesar Rp ${values.amount.toLocaleString('id-ID')} telah dicatat.`
                })

                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push("/dashboard")
                }
                router.refresh()
            }
        } catch (error) {
            setServerError("Terjadi kesalahan sistem")
            toast.error("Error Sistem", {
                description: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-xl font-bold">Input Transaksi Baru</h2>
                <p className="text-sm text-muted-foreground mt-1">Lengkapi detail transaksi di bawah ini.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Transaction Type */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Jenis Transaksi</FormLabel>
                                <FormControl>
                                    <div className="flex gap-4">
                                        <div
                                            className={cn(
                                                "flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all text-center font-semibold",
                                                field.value === "INCOME"
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-gray-200 hover:border-emerald-200"
                                            )}
                                            onClick={() => {
                                                field.onChange("INCOME")
                                                form.setValue("categoryId", "") // Reset category
                                            }}
                                        >
                                            Pemasukan (Infaq/Donasi)
                                        </div>
                                        <div
                                            className={cn(
                                                "flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all text-center font-semibold",
                                                field.value === "EXPENSE"
                                                    ? "border-red-500 bg-red-50 text-red-700"
                                                    : "border-gray-200 hover:border-red-200"
                                            )}
                                            onClick={() => {
                                                field.onChange("EXPENSE")
                                                form.setValue("categoryId", "") // Reset category
                                            }}
                                        >
                                            Pengeluaran (Belanja)
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Grid */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Kategori</FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {filteredCategories.length === 0 ? (
                                            <div className="col-span-full p-4 border border-dashed rounded-lg text-center text-gray-500 bg-gray-50">
                                                <p className="text-sm">Belum ada kategori untuk tipe ini.</p>
                                            </div>
                                        ) : (
                                            filteredCategories.map((category) => {
                                                const isSelected = field.value === category.id

                                                return (
                                                    <div
                                                        key={category.id}
                                                        onClick={() => field.onChange(category.id)}
                                                        className={cn(
                                                            "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50",
                                                            isSelected
                                                                ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                                                                : "border-gray-100 bg-white hover:border-gray-200"
                                                        )}
                                                        style={isSelected ? { borderColor: category.color, backgroundColor: `${category.color}10` } : {}}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                                                                isSelected ? "bg-white shadow-sm" : "bg-gray-100"
                                                            )}
                                                            style={isSelected ? { color: category.color } : { color: '#6b7280' }}
                                                        >
                                                            {/* Simple dynamic icon mapping or fallback */}
                                                            <CategoryIcon iconName={category.icon} />
                                                        </div>
                                                        <span className={cn(
                                                            "text-sm font-medium text-center",
                                                            isSelected ? "text-gray-900" : "text-gray-600"
                                                        )}>
                                                            {category.name}
                                                        </span>

                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                                                        )}
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Amount */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nominal (Rp)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="text-lg font-mono"
                                        // Spread field but override value and onChange
                                        {...field}
                                        value={field.value === 0 ? "" : field.value}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            // If empty, set to 0 (or undefined if allowed, but schema likely needs number)
                                            // We convert to number, but if string is empty we pass 0 to store
                                            field.onChange(val === "" ? 0 : Number(val))
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date */}
                    <FormField
                        control={form.control}
                        name="transactionDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel>Tanggal Transaksi</FormLabel>

                                {/* Quick Date Selectors */}
                                <div className="flex gap-2 mb-1">
                                    <div
                                        onClick={() => field.onChange(new Date())}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer border transition-colors",
                                            format(field.value, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                                                ? "bg-primary-50 text-primary-700 border-primary-200"
                                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                        )}
                                    >
                                        Hari Ini
                                    </div>
                                    <div
                                        onClick={() => {
                                            const yes = new Date()
                                            yes.setDate(yes.getDate() - 1)
                                            field.onChange(yes)
                                        }}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer border transition-colors",
                                            format(field.value, 'yyyy-MM-dd') === format(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd')
                                                ? "bg-primary-50 text-primary-700 border-primary-200"
                                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                        )}
                                    >
                                        Kemarin
                                    </div>
                                </div>

                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            className="w-full block pl-10" // Add padding for icon
                                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                            onChange={(e) => {
                                                // Handle invalid date clearing
                                                if (!e.target.value) return;
                                                field.onChange(new Date(e.target.value));
                                            }}
                                        />
                                        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                                    </div>
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
                                <FormLabel>Keterangan</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Pembayaran Listrik Bulan Juni" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {serverError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium">
                            {serverError}
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan Transaksi"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
