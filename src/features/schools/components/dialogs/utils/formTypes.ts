import type { School } from '@/schemas/schoolSchemas'

export interface UseSchoolFormStateProps {
  school?: School | null
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: (school: School) => void
  onSchoolCreated?: ((school: School) => void) | undefined
  onSchoolUpdated?: ((school: School) => void) | undefined
  onSchoolDeleted?: (() => void) | undefined
}

export interface FormErrors {
  [key: string]: string
}

export interface UseSchoolFormStateReturn {
  formData: Partial<School>
  errors: FormErrors
  isSubmitting: boolean
  isEditing: boolean
  isLoading: boolean
  updateField: (field: string, value: any) => void
  resetForm: () => void
  handleSubmit: () => Promise<void>
  handleDelete: () => Promise<void>
  validateForm: () => boolean
}

export const initialFormData: Partial<School> = {
  code: 0,
  schoolName: '',
  administrativeDependency: '',
  stateCode: '',
  municipality: '',
  district: '',
  schoolType: 0,
  schoolTypeDescription: '',
  situationCode: 0,
  schoolCode: 0,
  metrics: undefined
} 