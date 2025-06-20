import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { SchoolsTableView } from './SchoolsTableView'
import { useSchoolsTableController } from '../hooks/useSchoolsTableController'

interface SchoolsTableContainerProps {
  onDataChanged?: (data: any) => void
  onError?: (error: Error) => void
  onSchoolSelected?: (school: any) => void
  onSchoolDoubleClicked?: (school: any) => void
  onSelectionChanged?: (selectedCount: number) => void
  className?: string
}

export interface SchoolsTableHandle {
  exportToCsv: (filename?: string) => boolean
  exportVisiblePageToCsv: (filename?: string) => boolean
  exportSelectedToCsv: (filename?: string) => boolean
  exportAllColumnsToCsv: (filename?: string) => boolean
  autoSizeColumns: () => void
  refresh: () => void
  isLoading: boolean
  isGridReady: boolean
}

export const SchoolsTableContainer = forwardRef<SchoolsTableHandle, SchoolsTableContainerProps>(({
  onDataChanged,
  onError,
  onSchoolSelected,
  onSchoolDoubleClicked,
  onSelectionChanged,
  className = 'ag-theme-quartz-dark'
}, ref) => {
  const controllerProps = useMemo(() => {
    const props: Parameters<typeof useSchoolsTableController>[0] = {}
    if (onDataChanged) props.onDataChanged = onDataChanged
    if (onError) props.onError = onError
    if (onSchoolSelected) props.onSchoolSelected = onSchoolSelected
    if (onSchoolDoubleClicked) props.onSchoolDoubleClicked = onSchoolDoubleClicked
    if (onSelectionChanged) props.onSelectionChanged = onSelectionChanged
    return props
  }, [onDataChanged, onError, onSchoolSelected, onSchoolDoubleClicked, onSelectionChanged])

  const controller = useSchoolsTableController(controllerProps)

  useImperativeHandle(ref, () => ({
    exportToCsv: controller.exportToCsv,
    exportVisiblePageToCsv: controller.exportVisiblePageToCsv,
    exportSelectedToCsv: controller.exportSelectedToCsv,
    exportAllColumnsToCsv: controller.exportAllColumnsToCsv,
    autoSizeColumns: controller.autoSizeColumns,
    refresh: controller.refresh,
    isLoading: controller.isLoading,
    isGridReady: controller.isGridReady,
  }), [controller])

  return (
    <SchoolsTableView
      gridOptions={controller.gridOptions}
      onGridReady={controller.onGridReady}
      onPaginationChanged={controller.onPaginationChanged}
      onSortChanged={controller.onSortChanged}
      onFilterChanged={controller.onFilterChanged}
      onRowDataUpdated={controller.onRowDataUpdated}
      isLoading={controller.isLoading}
      error={controller.error}
      className={className}
    />
  )
})

SchoolsTableContainer.displayName = 'SchoolsTableContainer'
export { useSchoolsTableController } from '../hooks/useSchoolsTableController'