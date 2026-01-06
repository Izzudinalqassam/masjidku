"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { updateUserProfile } from "@/lib/actions/user"

const userProfileSchema = z.object({
    fullName: z.string().min(1, "Nama lengkap harus diisi"),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false
    }
    return true
}, {
    message: "Password saat ini diperlukan untuk mengubah password",
    path: ["currentPassword"],
}).refine((data) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false
    }
    return true
}, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
})

interface UserProfileDialogProps {
    children: React.ReactNode
    currentName?: string
    currentEmail?: string
}

export function UserProfileDialog({ children, currentName, currentEmail }: UserProfileDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof userProfileSchema>>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            fullName: currentName || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof userProfileSchema>) {
        setIsLoading(true)
        try {
            const result = await updateUserProfile(values)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Profil berhasil diperbarui")
                setOpen(false)
                form.reset({
                    fullName: values.fullName,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Pengaturan Akun</DialogTitle>
                    <DialogDescription>
                        Ubah informasi profil dan password akun Anda di sini.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-3 p-3 mb-4 bg-muted/50 rounded-lg border">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium">{currentName}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentEmail}</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-medium text-muted-foreground">Ubah Password (Opsional)</h4>

                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password Saat Ini</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="***" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password Baru</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="***" {...field} />
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
                                            <FormLabel>Konfirmasi</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="***" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
