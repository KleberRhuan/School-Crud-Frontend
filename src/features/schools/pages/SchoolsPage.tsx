import React, { useCallback, useState } from 'react'
import {
  Box,
  Fab,
  Paper,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { SchoolsHeader } from './SchoolsHeader'
import { SchoolsTableContainer } from '../components/SchoolsTableContainer'
import { SchoolsDialogs } from './SchoolsDialogs'
import { useSchoolColumns } from '../hooks/useSchoolColumns'
import type { School } from '@/schemas/schoolSchemas'
import { useSchoolsTableController } from '../hooks'

interface SchoolsPageProps {
  title?: string
}

export const SchoolsPage: React.FC<SchoolsPageProps> = ({
  title = 'Gestão de Escolas'
}) => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isColumnsDialogOpen, setIsColumnsDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isSchoolFormOpen, setIsSchoolFormOpen] = useState(false)
  const [isSchoolDetailOpen, setIsSchoolDetailOpen] = useState(false)

  const { totalColumns, isLoadingColumns, metricsSource, apiError } = useSchoolColumns()
  const { exportToCsv } = useSchoolsTableController()

  const handleNewSchool = useCallback(() => {
    setSelectedSchool(null)
    setIsSchoolFormOpen(true)
  }, [])

  const handleEditSchool = useCallback(() => {
    if (selectedSchool) {
      setIsSchoolFormOpen(true)
    }
  }, [selectedSchool])

  const handleSchoolSelected = useCallback((school: School | null) => {
    setSelectedSchool(school)
  }, [])

  const handleSchoolDoubleClicked = useCallback((school: School) => {
    setSelectedSchool(school)
    setIsSchoolFormOpen(true)
  }, [])

  const handleExport = useCallback(() => {
    exportToCsv(`escolas-${new Date().toISOString().split('T')[0]}.csv`)
  }, [exportToCsv])

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      <SchoolsHeader
        title={title}
        totalColumns={totalColumns}
        isLoadingColumns={isLoadingColumns}
        metricsSource={metricsSource as any}
        apiError={apiError}
        onExport={handleExport}
        onOpenFilterDialog={() => setIsFilterDialogOpen(true)}
        onOpenColumnsDialog={() => setIsColumnsDialogOpen(true)}
        onOpenImportDialog={() => setIsImportDialogOpen(true)}
        onNewSchool={handleNewSchool}
      />

      <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SchoolsTableContainer 
          onSchoolSelected={handleSchoolSelected}
          onSchoolDoubleClicked={handleSchoolDoubleClicked}
        />
      </Paper>

      {selectedSchool && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleEditSchool}
        >
          <EditIcon />
        </Fab>
      )}

      <SchoolsDialogs
        totalColumns={totalColumns}
        metricsSource={metricsSource as any}
        isFilterDialogOpen={isFilterDialogOpen}
        setFilterDialogOpen={setIsFilterDialogOpen}
        isColumnsDialogOpen={isColumnsDialogOpen}
        setColumnsDialogOpen={setIsColumnsDialogOpen}
        isImportDialogOpen={isImportDialogOpen}
        setImportDialogOpen={setIsImportDialogOpen}
        isSchoolFormOpen={isSchoolFormOpen}
        setSchoolFormOpen={setIsSchoolFormOpen}
        isSchoolDetailOpen={isSchoolDetailOpen}
        setSchoolDetailOpen={setIsSchoolDetailOpen}
        selectedSchool={selectedSchool}
      />
    </Box>
  )
} 