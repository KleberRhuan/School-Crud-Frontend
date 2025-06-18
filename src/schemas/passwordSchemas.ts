import { z } from 'zod'

export const strongPasswordSchema = z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
        'Senha deve conter: maiúscula, minúscula, número e caractere especial'
    )

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .transform((email) => email.toLowerCase().trim()),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;