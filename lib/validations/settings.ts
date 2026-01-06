import { z } from "zod"

export const settingsSchema = z.object({
    name: z.string().min(1, "Nama masjid harus diisi"),
    address: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    email: z.string().email("Email tidak valid").optional().or(z.literal("")).default(""),
    openingBalance: z.preprocess((val) => Number(val), z.number().min(0, "Saldo awal tidak boleh negatif")),
    openingDate: z.date(),
})

export type SettingsValues = z.infer<typeof settingsSchema>
