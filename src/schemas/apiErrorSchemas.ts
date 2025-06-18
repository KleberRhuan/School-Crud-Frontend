import {z} from "zod";

export const violationItemSchema = z.object({
    name: z.string(),
    message: z.string()
})

export const violationsSchema = z.object({
    items: z.array(violationItemSchema)
})

export const apiErrorSchema = z.object({
    status: z.number(),
    type: z.string(),
    title: z.string(),
    detail: z.string().optional(),
    userMessage: z.string().optional(),
    timestamp: z.string(),
    violations: violationsSchema.optional()
})

