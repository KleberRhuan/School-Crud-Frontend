import type { ReactNode } from 'react'

// Tipos comuns para todas as seções
export interface BaseSectionProps {
  formData: any
  errors: any
  updateField: (field: any, value: any) => void
}

export interface BasicInfoSectionProps extends BaseSectionProps {
  isEditing: boolean
}

export type LocationSectionProps = BaseSectionProps

export type ClassificationSectionProps = BaseSectionProps

export type MetricsSectionProps = BaseSectionProps

export interface FormSectionProps {
  title: string
  children: ReactNode
} 