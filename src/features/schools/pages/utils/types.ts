import type { School } from '@/schemas/schoolSchemas'
import type { SchoolsTableHandle } from '../../components/SchoolsTableContainer'

export interface SchoolsPageProps {
  title?: string
}

export interface DialogStates {
  isFilterDialogOpen: boolean
  isColumnsDialogOpen: boolean
  isImportDialogOpen: boolean
  isSchoolFormOpen: boolean
  isSchoolDetailOpen: boolean
}

export interface SchoolsPageState {
  selectedSchool: School | null
  selectedRowsCount: number
  totalRowsCount: number
  dialogStates: DialogStates
}

export interface SchoolsPageHandlers {
  handleSchoolCreated: (school: School) => void
  handleSchoolUpdated: (school: School) => void
  handleSchoolDeleted: () => void
  handleImportCompleted: () => void
  handleNewSchool: () => void
  handleEditSchool: () => void
  handleSchoolSelected: (school: School | null) => void
  handleSchoolDoubleClicked: (school: School) => void
  handleExport: () => void
  handleExportSelected: () => void
  handleExportAllColumns: () => void
  handleDataChanged: (data: any) => void
  handleSelectionChanged: (selectedCount: number) => void
}

export interface ExportHandlerParams {
  tableRef: React.RefObject<SchoolsTableHandle | null>
  toast: any
  selectedRowsCount: number
  totalRowsCount: number
} 