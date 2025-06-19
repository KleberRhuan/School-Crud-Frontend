import React from 'react'
import type { School } from '@/schemas/schoolSchemas'
import { FilterDialog } from '../components/dialogs/FilterDialog'
import { ColumnsDialog } from '../components/dialogs/ColumnsDialog'
import { ImportDialog } from '../components/dialogs/ImportDialog'
import { SchoolFormDialog } from '../components/dialogs/SchoolFormDialog'
import { SchoolDetailDialog } from '../components/dialogs/SchoolDetailDialog'

interface SchoolsDialogsProps {
  totalColumns: number
  metricsSource: 'api' | 'local'
  isFilterDialogOpen: boolean
  setFilterDialogOpen: (open: boolean) => void
  isColumnsDialogOpen: boolean
  setColumnsDialogOpen: (open: boolean) => void
  isImportDialogOpen: boolean
  setImportDialogOpen: (open: boolean) => void
  isSchoolFormOpen: boolean
  setSchoolFormOpen: (open: boolean) => void
  isSchoolDetailOpen: boolean
  setSchoolDetailOpen: (open: boolean) => void
  selectedSchool: School | null
}

export const SchoolsDialogs: React.FC<SchoolsDialogsProps> = ({
  totalColumns,
  metricsSource,
  isFilterDialogOpen,
  setFilterDialogOpen,
  isColumnsDialogOpen,
  setColumnsDialogOpen,
  isImportDialogOpen,
  setImportDialogOpen,
  isSchoolFormOpen,
  setSchoolFormOpen,
  isSchoolDetailOpen,
  setSchoolDetailOpen,
  selectedSchool,
}) => (
  <>
    <FilterDialog
      open={isFilterDialogOpen}
      onClose={() => setFilterDialogOpen(false)}
    />

    <ColumnsDialog
      open={isColumnsDialogOpen}
      onClose={() => setColumnsDialogOpen(false)}
      totalColumns={totalColumns}
      metricsSource={metricsSource}
    />

    <ImportDialog
      open={isImportDialogOpen}
      onClose={() => setImportDialogOpen(false)}
    />

    <SchoolFormDialog
      open={isSchoolFormOpen}
      onClose={() => setSchoolFormOpen(false)}
      selectedSchool={selectedSchool}
    />

    <SchoolDetailDialog
      open={isSchoolDetailOpen}
      onClose={() => setSchoolDetailOpen(false)}
      onEdit={() => {
        setSchoolDetailOpen(false)
        setSchoolFormOpen(true)
      }}
      selectedSchool={selectedSchool}
    />
  </>
)

SchoolsDialogs.displayName = 'SchoolsDialogs' 