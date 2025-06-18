import React from "react";
import { apiErrorSchema, violationItemSchema } from "@/schemas/apiErrorSchemas";
import { z } from "zod";

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
export type ViolationItem = z.infer<typeof violationItemSchema>;

export interface ToastOptions {
  persist?: boolean;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
  style?: React.CSSProperties;
}

export interface ApiErrorContext {
  operation?: string;
  resource?: string;
  userId?: string;
  traceId?: string;
  timestamp?: string;
  additionalInfo?: Record<string, unknown>;
  method?: string;
  url?: string;
  status?: number;
  [key: string]: unknown;
}

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastResult {
  message: string;
  persist?: boolean;
  key?: string;
}

export const DEFAULT_DURATION = {
  success: 2000,
  error: 5000,
  warning: 4000,
  info: 3000,
} as const; 