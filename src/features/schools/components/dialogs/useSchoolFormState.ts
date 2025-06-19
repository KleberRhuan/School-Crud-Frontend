import { useCallback, useEffect, useState } from 'react'
import { useCreateSchool, useUpdateSchool } from '../../hooks/useSchoolMutations'
import type { School, SchoolCreateRequest, SchoolUpdateRequest } from '@/schemas/schoolSchemas'

interface UseSchoolFormStateProps {
  school?: School | null
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: (school: School) => void
}

interface FormErrors {
  [key: string]: string
}

interface UseSchoolFormStateReturn {
  formData: Partial<School>
  errors: FormErrors
  isSubmitting: boolean
  isEditing: boolean
  isLoading: boolean
  updateField: (field: string, value: any) => void
  resetForm: () => void
  handleSubmit: () => Promise<void>
  validateForm: () => boolean
}

const initialFormData: Partial<School> = {
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

export const useSchoolFormState = ({
  school,
  isOpen = true,
  onClose,
  onSuccess
}: UseSchoolFormStateProps): UseSchoolFormStateReturn => {
  const [formData, setFormData] = useState<Partial<School>>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createSchool = useCreateSchool()
  const updateSchool = useUpdateSchool()

  const isEditing = !!school?.code
  const isLoading = createSchool.status === 'pending' || updateSchool.status === 'pending'

  const validateField = (field: string, value: any): string => {
    if (field === 'code' && (!value || value === 0)) {
      return 'Código é obrigatório'
    }
    
    if (field === 'schoolName' && (!value || value.trim() === '')) {
      return 'Nome da escola é obrigatório'
    }
    
    return ''
  }

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    const requiredFields = ['code', 'schoolName']

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof School])
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  useEffect(() => {
    if (isOpen && school) {
      const schoolWithFlatMetrics = {
        ...school,
        metrics: school.metrics?.metrics || {}
      }
      setFormData(schoolWithFlatMetrics)
    } else if (isOpen) {
      setFormData({ ...initialFormData, metrics: {} })
    }
    setErrors({})
  }, [school, isOpen])

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const resetForm = useCallback(() => {
    setFormData({ ...initialFormData })
    setErrors({})
    setIsSubmitting(false)
  }, [])

  const prepareCreateData = (data: Partial<School>): SchoolCreateRequest => {
    return {
      code: Number(data.code!),
      schoolName: data.schoolName!,
      administrativeDependency: data.administrativeDependency,
      stateCode: data.stateCode,
      municipality: data.municipality,
      district: data.district,
      schoolType: data.schoolType ? Number(data.schoolType) : undefined,
      schoolTypeDescription: data.schoolTypeDescription,
      situationCode: data.situationCode ? Number(data.situationCode) : undefined,
      schoolCode: data.schoolCode ? Number(data.schoolCode) : undefined,
      metrics: data.metrics && Object.keys(data.metrics).length > 0 ? data.metrics as Record<string, number> : undefined
    }
  }

  const prepareUpdateData = (data: Partial<School>): SchoolUpdateRequest => {
    return {
      schoolName: data.schoolName,
      administrativeDependency: data.administrativeDependency,
      stateCode: data.stateCode,
      municipality: data.municipality,
      district: data.district,
      schoolType: data.schoolType ? Number(data.schoolType) : undefined,
      schoolTypeDescription: data.schoolTypeDescription,
      situationCode: data.situationCode ? Number(data.situationCode) : undefined,
      schoolCode: data.schoolCode ? Number(data.schoolCode) : undefined,
      metrics: data.metrics && Object.keys(data.metrics).length > 0 ? data.metrics as Record<string, number> : undefined
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const mutationPromise = school?.code
        ? updateSchool.mutateAsync({ code: school.code, data: prepareUpdateData(formData) })
        : createSchool.mutateAsync(prepareCreateData(formData))

      const result = await mutationPromise
      
      resetForm()
      onSuccess?.(result)
      onClose?.()
    } catch (error) {
      void error
      setErrors({})
      setIsSubmitting(false)
    }
  }, [
    formData,
    school,
    validateForm,
    createSchool,
    updateSchool,
    resetForm,
    onSuccess,
    onClose
  ])

  return {
    formData,
    errors,
    isSubmitting,
    isEditing,
    isLoading,
    updateField,
    resetForm,
    handleSubmit,
    validateForm
  }
} 