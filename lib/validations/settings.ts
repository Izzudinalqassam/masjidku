import { z } from "zod"

export const settingsSchema = z.object({
    name: z.string().min(1, "Nama masjid harus diisi"),
    address: z.string().min(0),
    phone: z.string().min(0),
    email: z.string().min(0).refine(
        (val) => val === "" || z.string().email().safeParse(val).success,
        { message: "Email tidak valid" }
    ),
    openingBalance: z.any()
        .transform((val) => {
            if (typeof val === 'number') return val
            return Number(val) || 0
        })
        .pipe(z.number().min(0, "Saldo awal tidak boleh negatif")),
    openingDate: z.date(),
})

export type SettingsValues = z.infer<typeof settingsSchema>
