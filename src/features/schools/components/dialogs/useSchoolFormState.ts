import { useCallback, useEffect, useState } from 'react'
import { useCreateSchool, useDeleteSchool, useUpdateSchool } from '../../hooks/useSchoolMutations'
import { 
  createDeleteHandler,
  createSubmitHandler,
  type FormErrors,
  initialFormData,
  prepareFormDataFromSchool,
  type UseSchoolFormStateProps,
  type UseSchoolFormStateReturn,
  validateForm
} from './utils'

export const useSchoolFormState = ({
  school,
  isOpen = true,
  onClose,
  onSuccess,
  onSchoolCreated,
  onSchoolUpdated,
  onSchoolDeleted
}: UseSchoolFormStateProps): UseSchoolFormStateReturn => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createSchool = useCreateSchool()
  const updateSchool = useUpdateSchool()
  const deleteSchool = useDeleteSchool()

  const isEditing = !!school?.code
  const isLoading = createSchool.status === 'pending' || updateSchool.status === 'pending' || deleteSchool.status === 'pending'

  const validateFormCallback = useCallback((): boolean => {
    const { isValid, errors: validationErrors } = validateForm(formData)
    setErrors(validationErrors)
    return isValid
  }, [formData])

  useEffect(() => {
    if (isOpen && school) {
      setFormData(prepareFormDataFromSchool(school))
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

  const handleSubmit = useCallback(
    createSubmitHandler({
      formData,
      school,
      validateFormFn: validateFormCallback,
      createSchool,
      updateSchool,
      resetForm,
      callbacks: {
        onSchoolCreated: onSchoolCreated || undefined,
        onSchoolUpdated: onSchoolUpdated || undefined,
        onSuccess: onSuccess || undefined,
        onClose: onClose || undefined
      },
      setIsSubmitting,
      setErrors
    }),
    [formData, school, validateFormCallback, createSchool, updateSchool, resetForm, onSchoolCreated, onSchoolUpdated, onSuccess, onClose]
  )

  const handleDelete = useCallback(
    createDeleteHandler({
      school,
      deleteSchool,
      resetForm,
      callbacks: { 
        onSchoolDeleted: onSchoolDeleted || undefined, 
        onClose: onClose || undefined 
      },
      setIsSubmitting
    }),
    [school, deleteSchool, resetForm, onSchoolDeleted, onClose]
  )

  return {
    formData,
    errors,
    isSubmitting,
    isEditing,
    isLoading,
    updateField,
    resetForm,
    handleSubmit,
    handleDelete,
    validateForm: validateFormCallback
  }
} 