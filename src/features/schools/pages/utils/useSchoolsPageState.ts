import { useCallback, useRef, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { useSchoolColumns } from '../../hooks/useSchoolColumns'
import type { School } from '@/schemas/schoolSchemas'
import type { SchoolsTableHandle } from '../../components/SchoolsTableContainer'
import type { DialogStates } from './types'
import { createDialogHandlers } from './dialogHandlers'
import { createExportHandlers } from './exportHandlers'
import { createCrudHandlers } from './crudHandlers'

const initialDialogStates: DialogStates = {
  isFilterDialogOpen: false,
  isColumnsDialogOpen: false,
  isImportDialogOpen: false,
  isSchoolFormOpen: false,
  isSchoolDetailOpen: false
}

export const useSchoolsPageState = () => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [selectedRowsCount, setSelectedRowsCount] = useState(0)
  const [totalRowsCount, setTotalRowsCount] = useState(0)
  const [dialogStates, setDialogStates] = useState<DialogStates>(initialDialogStates)

  const toast = useToast()
  const { totalColumns, isLoadingColumns, metricsSource, apiError } = useSchoolColumns()
  
  const tableRef = useRef<SchoolsTableHandle>(null)

  const crudHandlers = createCrudHandlers({
    tableRef,
    toast,
    setSelectedSchool
  })

  const dialogHandlers = createDialogHandlers({
    selectedSchool,
    setSelectedSchool,
    setDialogStates
  })

  const exportHandlers = createExportHandlers({
    tableRef,
    toast,
    selectedRowsCount,
    totalRowsCount
  })

  const handleDataChanged = useCallback((data: any) => {
    setTotalRowsCount(data?.length || 0)
  }, [])

  const handleSelectionChanged = useCallback((selectedCount: number) => {
    setSelectedRowsCount(selectedCount)
  }, [])

  const isLoading = tableRef.current?.isLoading || false

  return {
    // Estados
    selectedSchool,
    selectedRowsCount,
    totalRowsCount,
    dialogStates,
    setDialogStates,
    
    // Dados externos
    totalColumns,
    isLoadingColumns,
    metricsSource,
    apiError,
    isLoading,
    
    // Refs
    tableRef,
    
    // Handlers
    ...crudHandlers,
    ...dialogHandlers,
    ...exportHandlers,
    handleDataChanged,
    handleSelectionChanged
  }
} 