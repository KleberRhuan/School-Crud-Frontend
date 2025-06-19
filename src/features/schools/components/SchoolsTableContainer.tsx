import React, { useMemo } from 'react'
import { SchoolsTableView } from './SchoolsTableView'
import { useSchoolsTableController } from '../hooks/useSchoolsTableController'

interface SchoolsTableContainerProps {
  onDataChanged?: (data: any) => void
  onError?: (error: Error) => void
  onSchoolSelected?: (school: any) => void
  onSchoolDoubleClicked?: (school: any) => void
  className?: string
}

export const SchoolsTableContainer: React.FC<SchoolsTableContainerProps> = ({
  onDataChanged,
  onError,
  onSchoolSelected,
  onSchoolDoubleClicked,
  className = 'ag-theme-quartz-dark'
}) => {
  // Memoizar as props do controller para evitar problemas de Fast refresh
  const controllerProps = useMemo(() => {
    const props: Parameters<typeof useSchoolsTableController>[0] = {}
    if (onDataChanged) props.onDataChanged = onDataChanged
    if (onError) props.onError = onError
    if (onSchoolSelected) props.onSchoolSelected = onSchoolSelected
    if (onSchoolDoubleClicked) props.onSchoolDoubleClicked = onSchoolDoubleClicked
    return props
  }, [onDataChanged, onError, onSchoolSelected, onSchoolDoubleClicked])

  const controller = useSchoolsTableController(controllerProps)

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
}

// Export do controller para casos de uso avançado
export { useSchoolsTableController } from '../hooks/useSchoolsTableController' 