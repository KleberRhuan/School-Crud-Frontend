import type { School } from '@/schemas/schoolSchemas'
import type { DialogStates } from './types'

export interface DialogHandlerParams {
  selectedSchool: School | null
  setSelectedSchool: (school: School | null) => void
  setDialogStates: React.Dispatch<React.SetStateAction<DialogStates>>
}

export const createDialogHandlers = ({
  selectedSchool,
  setSelectedSchool,
  setDialogStates
}: DialogHandlerParams) => {
  const handleNewSchool = () => {
    setSelectedSchool(null)
    setDialogStates(prev => ({ ...prev, isSchoolFormOpen: true }))
  }

  const handleEditSchool = () => {
    if (selectedSchool) {
      setDialogStates(prev => ({ ...prev, isSchoolFormOpen: true }))
    }
  }

  const handleSchoolSelected = (school: School | null) => {
    setSelectedSchool(school)
  }

  const handleSchoolDoubleClicked = (school: School) => {
    setSelectedSchool(school)
    setDialogStates(prev => ({ ...prev, isSchoolFormOpen: true }))
  }

  const handleOpenFilterDialog = () => {
    setDialogStates(prev => ({ ...prev, isFilterDialogOpen: true }))
  }

  const handleOpenColumnsDialog = () => {
    setDialogStates(prev => ({ ...prev, isColumnsDialogOpen: true }))
  }

  const handleOpenImportDialog = () => {
    setDialogStates(prev => ({ ...prev, isImportDialogOpen: true }))
  }

  return {
    handleNewSchool,
    handleEditSchool,
    handleSchoolSelected,
    handleSchoolDoubleClicked,
    handleOpenFilterDialog,
    handleOpenColumnsDialog,
    handleOpenImportDialog
  }
} 