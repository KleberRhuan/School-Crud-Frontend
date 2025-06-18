import { z } from 'zod'
import {strongPasswordSchema} from "@/schemas/passwordSchemas.ts";

// Schema para User
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  avatar: z.string().url().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Schema para LoginRequest
export const loginRequestSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean().optional(),
})

// Schema para LoginResponse
export const loginResponseSchema = z.object({
  tokenType: z.string(),
  accessToken: z.string()
})

// Schema para RegisterRequest
export const registerRequestSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: strongPasswordSchema,
})

// Schema para Upload Response
export const uploadResponseSchema = z.object({
  id: z.string(),
  filename: z.string(),
  size: z.number(),
  status: z.enum(['pending', 'processing', 'completed', 'error']),
  progress: z.number().min(0).max(100).optional(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Schema para Upload Status
export const uploadStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'error']),
  progress: z.number().min(0).max(100),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
  result: z.record(z.any()).optional(),
})

// Tipos TypeScript derivados dos schemas
export type User = z.infer<typeof userSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type TokenResponse = z.infer<typeof loginResponseSchema>
export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type UploadResponse = z.infer<typeof uploadResponseSchema>
export type UploadStatus = z.infer<typeof uploadStatusSchema>

// Type para PaginatedResponse genérico
export type PaginatedResponse<T = any> = {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
} 