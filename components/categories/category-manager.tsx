"use client"

import { useState } from "react"
import { Category } from "@prisma/client"
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CategoryIcon, iconOptions } from "@/components/icons/category-icon"
import { categorySchema } from "@/lib/validations"
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories"
import { cn } from "@/lib/utils"

interface CategoryManagerProps {
    initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
    // Local state for optimistic updates could be used, but for now relying on revalidatePath
    // We initiate local state relative to props to show current data, 
    // but in a real 'server action with revalidate' flow, the page prop updates.
    // However, for immediate feedback if we want, we can update local state.
    // Since we use revalidatePath, the page will reload with new data.
    // So we should strictly valid initialCategories from props.

    // BUT: revalidatePath only updates server components. Client components props are updated when parent re-renders.
    // So using simple prop passing is fine.

    // Actually, let's just use the props directly for rendering list? 
    // But we need filtered list.

    const categories = initialCategories;

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [activeTab, setActiveTab] = useState("INCOME")
    const [isLoading, setIsLoading] = useState(false)

    // Filter categories based on active tab
    const filteredCategories = categories.filter(c => c.type === activeTab)

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            type: "INCOME",
            color: "#10b981",
            icon: "wallet",
        },
    })

    // Reset form when dialog opens/closes or mode changes
    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category)
            form.reset({
                name: category.name,
                type: category.type,
                color: category.color,
                icon: category.icon,
            })
        } else {
            setEditingCategory(null)
            form.reset({
                name: "",
                type: activeTab as "INCOME" | "EXPENSE",
                color: activeTab === "INCOME" ? "#10b981" : "#ef4444",
                icon: "wallet",
            })
        }
        setIsDialogOpen(true)
    }

    async function onSubmit(values: z.infer<typeof categorySchema>) {
        setIsLoading(true)
        try {
            if (editingCategory) {
                const result = await updateCategory(editingCategory.id, values)
                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success("Kategori berhasil diperbarui")
                    setIsDialogOpen(false)
                }
            } else {
                const result = await createCategory(values)
                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success("Kategori berhasil dibuat")
                    setIsDialogOpen(false)
                }
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Apakah anda yakin ingin menghapus kategori ini?")) {
            const result = await deleteCategory(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Kategori berhasil dihapus")
            }
        }
    }

    // Color presets
    const colors = [
        "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="INCOME">Pemasukan</TabsTrigger>
                        <TabsTrigger value="EXPENSE">Pengeluaran</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button onClick={() => handleOpenDialog()} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kategori
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCategories.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-gray-50 text-gray-500">
                        <p>Belum ada kategori {activeTab === "INCOME" ? "Pemasukan" : "Pengeluaran"}</p>
                        <Button variant="link" onClick={() => handleOpenDialog()}>
                            Buat sekarang
                        </Button>
                    </div>
                ) : (
                    filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="flex items-center justify-center w-12 h-12 rounded-full"
                                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                                >
                                    <CategoryIcon iconName={category.icon} className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                    <p className="text-xs text-gray-500 capitalize">{category.type.toLowerCase()}</p>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(category.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
                        <DialogDescription>
                            Isi detail kategori di bawah ini. Klik simpan jika sudah selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Kategori</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Infak Jumat" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ikon</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih ikon" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {iconOptions.map((icon) => (
                                                    <SelectItem key={icon.value} value={icon.value}>
                                                        <div className="flex items-center gap-2">
                                                            <CategoryIcon iconName={icon.value} className="w-4 h-4" />
                                                            {icon.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warna</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-2">
                                                {colors.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={cn(
                                                            "w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110",
                                                            field.value === color ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : ""
                                                        )}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => field.onChange(color)}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
