// Tipos e interfaces
export type { 
  UseSchoolFormStateProps, 
  FormErrors, 
  UseSchoolFormStateReturn 
} from './formTypes'
export { initialFormData } from './formTypes'

export { validateField, validateForm } from './formValidation'

export { 
  prepareCreateData, 
  prepareUpdateData, 
  prepareFormDataFromSchool 
} from './formDataPreparation'

export { createSubmitHandler, createDeleteHandler } from './formHandlers' 