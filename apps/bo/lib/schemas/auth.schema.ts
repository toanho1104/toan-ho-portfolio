import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Minimum 8 characters'),
})

// Derive type từ schema — không cần khai báo type riêng
export type LoginFormValues = z.infer<typeof loginSchema>
