import type { School } from '@/schemas/schoolSchemas'
import type { SchoolsTableHandle } from '../../components/SchoolsTableContainer'

export interface CrudHandlerParams {
  tableRef: React.RefObject<SchoolsTableHandle | null>
  toast: any
  setSelectedSchool: (school: School | null) => void
}

export const createCrudHandlers = ({
  tableRef,
  toast,
  setSelectedSchool
}: CrudHandlerParams) => {
  const refreshTable = () => {
    if (tableRef.current) {
      tableRef.current.refresh()
      toast.success('🔄 Tabela atualizada com sucesso!')
    }
  }

  const handleSchoolCreated = (school: School) => {
    setSelectedSchool(school) 
    refreshTable()
  }

  const handleSchoolUpdated = (school: School) => {
    setSelectedSchool(school)
    refreshTable()
  }

  const handleSchoolDeleted = () => {
    setSelectedSchool(null)
    refreshTable() 
  }

  const handleImportCompleted = () => {
    refreshTable()
  }

  return {
    refreshTable,
    handleSchoolCreated,
    handleSchoolUpdated,
    handleSchoolDeleted,
    handleImportCompleted
  }
} 