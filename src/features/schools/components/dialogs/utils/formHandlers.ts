import type { School } from '@/schemas/schoolSchemas'
import { prepareCreateData, prepareUpdateData } from './formDataPreparation'

interface CreateHandlerParams {
  formData: Partial<School>
  school?: School | null | undefined
  validateFormFn: () => boolean
  createSchool: any
  updateSchool: any
  resetForm: () => void
  callbacks: {
    onSchoolCreated?: ((school: School) => void) | undefined
    onSchoolUpdated?: ((school: School) => void) | undefined
    onSuccess?: ((school: School) => void) | undefined
    onClose?: (() => void) | undefined
  }
  setIsSubmitting: (value: boolean) => void
  setErrors: (errors: any) => void
}

export const createSubmitHandler = ({
  formData,
  school,
  validateFormFn,
  createSchool,
  updateSchool,
  resetForm,
  callbacks,
  setIsSubmitting,
  setErrors
}: CreateHandlerParams) => {
  return async () => {
    if (!validateFormFn()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const mutationPromise = school?.code
        ? updateSchool.mutateAsync({ code: school.code, data: prepareUpdateData(formData) })
        : createSchool.mutateAsync(prepareCreateData(formData))

      const result = await mutationPromise
      
      resetForm()
      
      if (school?.code) {
        callbacks.onSchoolUpdated?.(result)
      } else {
        callbacks.onSchoolCreated?.(result)
      }
    
      callbacks.onSuccess?.(result)
      callbacks.onClose?.()
    } catch (error) {
      void error
      setErrors({})
      setIsSubmitting(false)
    }
  }
}

interface DeleteHandlerParams {
  school?: School | null | undefined
  deleteSchool: any
  resetForm: () => void
  callbacks: {
    onSchoolDeleted?: (() => void) | undefined
    onClose?: (() => void) | undefined
  }
  setIsSubmitting: (value: boolean) => void
}

export const createDeleteHandler = ({
  school,
  deleteSchool,
  resetForm,
  callbacks,
  setIsSubmitting
}: DeleteHandlerParams) => {
  return async () => {
    if (!school?.code) {
      return
    }

    try {
      setIsSubmitting(true)
    
      await deleteSchool.mutateAsync(school.code)
      resetForm()
      callbacks.onSchoolDeleted?.()
      
      callbacks.onClose?.()
    } catch (error) {
      void error
      setIsSubmitting(false)
    }
  }
} 