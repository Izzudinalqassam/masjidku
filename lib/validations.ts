import { z } from 'zod'

// Transaction validation schemas
export const transactionSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    categoryId: z.string().min(1, 'Mohon pilih kategori'),
    amount: z.number().positive(),
    transactionDate: z.string().or(z.date()),
    description: z.string().min(3, 'Deskripsi minimal 3 karakter'),
    referenceNumber: z.string().optional(),
    metadata: z.record(z.any()).optional(),
})

export const transactionUpdateSchema = transactionSchema.partial()

// Category validation schemas
export const categorySchema = z.object({
    name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
    type: z.enum(['INCOME', 'EXPENSE']),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Format warna tidak valid'),
    icon: z.string().optional(),
    parentId: z.string().uuid().optional(),
})

// User validation schemas
export const userSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    role: z.enum(['ADMIN', 'BENDAHARA', 'KETUA_DKM', 'VIEWER']),
})

export const userUpdateSchema = userSchema.partial().omit({ password: true })

export const passwordUpdateSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6, 'Password minimal 6 karakter'),
})

// Mosque validation schemas
export const mosqueSchema = z.object({
    name: z.string().min(3, 'Nama masjid minimal 3 karakter'),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    openingBalance: z.number().optional(),
    openingDate: z.string().or(z.date()),
})

// Report filter schemas
export const reportFilterSchema = z.object({
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    type: z.enum(['INCOME', 'EXPENSE', 'ALL']).optional(),
    categoryId: z.string().uuid().optional(),
})
