import type { School } from '@/schemas/schoolSchemas'

export interface UseSchoolsTableControllerProps {
  onDataChanged?: (data: any) => void
  onError?: (error: Error) => void
  onSchoolSelected?: (school: School | null) => void
  onSchoolDoubleClicked?: (school: School) => void
  onSelectionChanged?: (selectedCount: number) => void
}

export interface ExportOptions {
  allColumns?: boolean
  onlySelected?: boolean
  includeHeaders?: boolean
  onlyVisiblePage?: boolean
} 