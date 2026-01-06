"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { Plus, Pencil, Trash2, Search, MoreVertical, Mail, Calendar, LayoutGrid, Table as TableIcon, Eye } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { createUser, updateUser, deleteUser } from "@/lib/actions/users"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"
import { PAGES_METADATA, DEFAULT_PERMISSIONS, ADMIN_PERMISSIONS, UserPermissions } from "@/lib/permissions"

const userSchema = z.object({
    fullName: z.string().min(1, "Nama lengkap harus diisi"),
    email: z.string().email("Email tidak valid"),
    role: z.enum(["ADMIN", "BENDAHARA", "KETUA_DKM", "VIEWER"]),
    password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    permissions: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
})

interface UserManagementProps {
    users: User[]
    currentUserId: string
}

export function UserManagement({ users, currentUserId }: UserManagementProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isViewOnly, setIsViewOnly] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: "",
            email: "",
            role: "VIEWER",
            password: "",
            confirmPassword: "",
            permissions: DEFAULT_PERMISSIONS,
        },
    })

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenDialog = (user?: any, viewOnly = false) => {
        setIsViewOnly(viewOnly)
        if (user) {
            setEditingUser(user)
            form.reset({
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                password: "",
                confirmPassword: "",
                permissions: user.permissions || DEFAULT_PERMISSIONS,
            })
        } else {
            setEditingUser(null)
            form.reset({
                fullName: "",
                email: "",
                role: "VIEWER",
                password: "",
                confirmPassword: "",
                permissions: DEFAULT_PERMISSIONS,
            })
        }
        setIsDialogOpen(true)
    }

    const handleRoleChange = (role: string) => {
        form.setValue('role', role as any);
        if (role === 'ADMIN') {
            form.setValue('permissions', ADMIN_PERMISSIONS);
        } else if (role === 'VIEWER') {
            const viewerPerms = JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS));
            form.setValue('permissions', viewerPerms);
        } else {
            form.setValue('permissions', DEFAULT_PERMISSIONS);
        }
    }

    async function onSubmit(values: z.infer<typeof userSchema>) {
        if (isViewOnly) {
            setIsDialogOpen(false)
            return
        }

        setIsLoading(true)
        try {
            if (editingUser) {
                const result = await updateUser(editingUser.id, values)
                if (result.error) toast.error(result.error)
                else {
                    toast.success("User berhasil diperbarui")
                    setIsDialogOpen(false)
                }
            } else {
                const result = await createUser(values)
                if (result.error) toast.error(result.error)
                else {
                    toast.success("User berhasil dibuat")
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
        if (confirm("Apakah anda yakin ingin menghapus user ini?")) {
            const result = await deleteUser(id)
            if (result.error) toast.error(result.error)
            else toast.success("User berhasil dihapus")
        }
    }

    const getRoleBadge = (role: string) => {
        const styles = {
            ADMIN: "bg-red-50 text-red-600",
            BENDAHARA: "bg-emerald-50 text-emerald-600",
            KETUA_DKM: "bg-blue-50 text-blue-600",
            VIEWER: "bg-gray-50 text-gray-600"
        }
        const style = styles[role as keyof typeof styles] || styles.VIEWER

        return (
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${style}`}>
                {role.replace('_', ' ')}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Cari nama atau email..."
                        className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                            onClick={() => setViewMode('table')}
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button onClick={() => handleOpenDialog()} className="bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow">
                        <Plus className="mr-2 h-4 w-4" />
                        User Baru
                    </Button>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredUsers.length === 0 ? (
                        <div className="col-span-full py-16 text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
                                <Search className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada pengguna ditemukan</p>
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="group relative bg-white p-5 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-lg font-bold text-gray-700 shadow-inner">
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 leading-tight">{user.fullName}</h3>
                                            {getRoleBadge(user.role)}
                                        </div>
                                    </div>
                                    {user.id !== currentUserId && (
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50" onClick={() => handleOpenDialog(user, true)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-50" onClick={() => handleOpenDialog(user)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(user.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Mail className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                        <span>{format(user.createdAt, "d MMM yyyy", { locale: id })}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[50px] text-center">No</TableHead>
                                <TableHead>Nama Pengguna</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Tanggal Gabung</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Tidak ada data pengguna.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.fullName}</span>
                                                {user.id === currentUserId && (
                                                    <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 border border-gray-200">YOU</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">{user.email}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell className="text-gray-600 text-sm">
                                            {format(user.createdAt, "d MMM yyyy, HH:mm", { locale: id })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {user.id !== currentUserId && (
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                        onClick={() => handleOpenDialog(user, true)}
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-2 text-gray-600 hover:text-gray-900"
                                                        onClick={() => handleOpenDialog(user)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-red-50/10"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] border-none shadow-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isViewOnly ? "Detail Pengguna" : editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
                        </DialogTitle>
                        <DialogDescription>
                            {isViewOnly ? "Informasi lengkap pengguna sistem." : "Manajemen akses untuk sistem."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Lengkap</FormLabel>
                                        <FormControl>
                                            <Input disabled={isViewOnly} className="bg-gray-50 border-gray-100" placeholder="Nama Lengkap" {...field} />
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
                                            <Input disabled={isViewOnly} className="bg-gray-50 border-gray-100" placeholder="email@mosque.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                handleRoleChange(val);
                                            }}
                                            defaultValue={field.value}
                                            disabled={isViewOnly}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-50 border-gray-100">
                                                    <SelectValue placeholder="Pilih Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                <SelectItem value="BENDAHARA">BENDAHARA</SelectItem>
                                                <SelectItem value="KETUA_DKM">KETUA_DKM</SelectItem>
                                                <SelectItem value="VIEWER">VIEWER</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <Label className="text-sm font-semibold text-gray-900">Hak Akses</Label>
                                <div className="border rounded-lg overflow-hidden border-gray-100">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow className="h-10">
                                                <TableHead className="text-xs">Modul</TableHead>
                                                <TableHead className="text-xs text-center">V</TableHead>
                                                <TableHead className="text-xs text-center">C</TableHead>
                                                <TableHead className="text-xs text-center">U</TableHead>
                                                <TableHead className="text-xs text-center">D</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {PAGES_METADATA.map((page) => (
                                                <TableRow key={page.id} className="h-10">
                                                    <TableCell className="text-xs font-medium py-2">{page.name}</TableCell>
                                                    <TableCell className="text-center py-2">
                                                        <Checkbox
                                                            disabled={isViewOnly}
                                                            checked={(form.watch('permissions') as any)?.[page.id]?.view}
                                                            onCheckedChange={(checked) => {
                                                                const perms = { ...form.getValues('permissions') };
                                                                if (!perms[page.id]) perms[page.id] = {};
                                                                perms[page.id].view = checked === true;
                                                                form.setValue('permissions', perms);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-center py-2">
                                                        {(page.actions as readonly string[]).includes('create') && (
                                                            <Checkbox
                                                                disabled={isViewOnly}
                                                                checked={(form.watch('permissions') as any)?.[page.id]?.create}
                                                                onCheckedChange={(checked) => {
                                                                    const perms = { ...(form.getValues('permissions') as any) };
                                                                    if (!perms[page.id]) perms[page.id] = {};
                                                                    perms[page.id].create = checked === true;
                                                                    form.setValue('permissions', perms);
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center py-2">
                                                        {(page.actions as readonly string[]).includes('update') && (
                                                            <Checkbox
                                                                disabled={isViewOnly}
                                                                checked={(form.watch('permissions') as any)?.[page.id]?.update}
                                                                onCheckedChange={(checked) => {
                                                                    const perms = { ...(form.getValues('permissions') as any) };
                                                                    if (!perms[page.id]) perms[page.id] = {};
                                                                    perms[page.id].update = checked === true;
                                                                    form.setValue('permissions', perms);
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center py-2">
                                                        {(page.actions as readonly string[]).includes('delete') && (
                                                            <Checkbox
                                                                disabled={isViewOnly}
                                                                checked={(form.watch('permissions') as any)?.[page.id]?.delete}
                                                                onCheckedChange={(checked) => {
                                                                    const perms = { ...(form.getValues('permissions') as any) };
                                                                    if (!perms[page.id]) perms[page.id] = {};
                                                                    perms[page.id].delete = checked === true;
                                                                    form.setValue('permissions', perms);
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="p-2 bg-gray-50 text-[10px] text-gray-500 italic">
                                        V: View, C: Create, U: Update, D: Delete
                                    </div>
                                </div>
                            </div>

                            {!isViewOnly && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{editingUser ? "Reset Password" : "Password"}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        className="bg-gray-50 border-gray-100"
                                                        placeholder={editingUser ? "(Opsional)" : "Min 6 karakter"}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{editingUser ? "Konfirmasi Reset" : "Konfirmasi Password"}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        className="bg-gray-50 border-gray-100"
                                                        placeholder={editingUser ? "(Opsional)" : "Ulangi password"}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            <DialogFooter>
                                {isViewOnly ? (
                                    <Button type="button" onClick={() => setIsDialogOpen(false)} className="w-full">
                                        Tutup
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 w-full">
                                        {isLoading ? "Memproses..." : "Simpan Data"}
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
