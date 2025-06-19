import { z } from 'zod'

// Esquema para métricas das escolas
export const schoolMetricsSchema = z.object({
  schoolCode: z.number().int().optional(),
  metrics: z.record(z.string(), z.number().int()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

// Esquema base da escola
export const schoolSchema = z.object({
  code: z.number().int(),
  schoolName: z.string().max(200).optional(),
  administrativeDependency: z.string().max(100).optional(),
  stateCode: z.string().max(10).optional(),
  municipality: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  schoolType: z.number().int().optional(),
  schoolTypeDescription: z.string().max(100).optional(),
  situationCode: z.number().int().optional(),
  schoolCode: z.number().int().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  metrics: schoolMetricsSchema.optional(),
})

// Esquema para criar escola
export const schoolCreateSchema = z.object({
  code: z.number().int(),
  schoolName: z.string().min(1, 'Nome da escola é obrigatório').max(200),
  administrativeDependency: z.string().max(100).optional(),
  stateCode: z.string().max(10).optional(),
  municipality: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  schoolType: z.number().int().optional(),
  schoolTypeDescription: z.string().max(100).optional(),
  situationCode: z.number().int().optional(),
  schoolCode: z.number().int().optional(),
  metrics: z.record(z.string(), z.number().int()).optional(),
})

// Esquema para atualizar escola
export const schoolUpdateSchema = z.object({
  schoolName: z.string().max(200).optional(),
  administrativeDependency: z.string().max(100).optional(),
  stateCode: z.string().max(10).optional(),
  municipality: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  schoolType: z.number().int().optional(),
  schoolTypeDescription: z.string().max(100).optional(),
  situationCode: z.number().int().optional(),
  schoolCode: z.number().int().optional(),
  metrics: z.record(z.string(), z.number().int()).optional(),
})

// Esquema para filtros de busca - corresponde exatamente aos parâmetros da API
export const schoolFiltersSchema = z.object({
  name: z.string().optional(), 
  municipalityName: z.string().optional(),
  stateAbbreviation: z.string().optional(),
  operationalStatus: z.number().int().optional(),
  dependencyType: z.number().int().optional(),
  schoolType: z.number().int().optional(),
  administrativeRegion: z.string().optional(),
  administrativeDependence: z.string().optional(),
  location: z.string().optional(),
  situation: z.string().optional(),
})

// Esquema para paginação
export const pageableSchema = z.object({
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  direction: z.enum(['ASC', 'DESC']).default('ASC'),
})

// Esquema para resposta paginada
export const paginatedResponseSchema = z.object({
  content: z.array(schoolSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  last: z.boolean(),
})

// Tipos TypeScript
export type School = z.infer<typeof schoolSchema>
export type SchoolMetrics = z.infer<typeof schoolMetricsSchema>
export type SchoolCreateRequest = z.infer<typeof schoolCreateSchema>
export type SchoolUpdateRequest = z.infer<typeof schoolUpdateSchema>
export type SchoolFilters = z.infer<typeof schoolFiltersSchema>
export type PageableRequest = z.infer<typeof pageableSchema>
export type PaginatedResponse<T = School> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
} 