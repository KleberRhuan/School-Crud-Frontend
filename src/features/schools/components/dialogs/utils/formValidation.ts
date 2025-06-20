import type { School } from '@/schemas/schoolSchemas'
import type { FormErrors } from './formTypes'

export const validateField = (field: string, value: any): string => {
  if (field === 'code' && (!value || value === 0)) {
    return 'Código é obrigatório'
  }
  
  if (field === 'schoolName' && (!value || value.trim() === '')) {
    return 'Nome da escola é obrigatório'
  }
  
  return ''
}

export const validateForm = (formData: Partial<School>): { isValid: boolean; errors: FormErrors } => {
  const newErrors: FormErrors = {}
  const requiredFields = ['code', 'schoolName']

  requiredFields.forEach(field => {
    const error = validateField(field, formData[field as keyof School])
    if (error) {
      newErrors[field] = error
    }
  })

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  }
} 