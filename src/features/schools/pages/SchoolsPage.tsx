import React from 'react'
import {
  Box,
  Fab,
  Paper,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { SchoolsHeader } from './SchoolsHeader'
import { SchoolsTableContainer } from '../components/SchoolsTableContainer'
import { SchoolsDialogs } from './SchoolsDialogs'
import { type SchoolsPageProps, useSchoolsPageState } from './utils'

export const SchoolsPage: React.FC<SchoolsPageProps> = ({
  title = 'Gestão de Escolas'
}) => {
  const {
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
    
    // Handlers CRUD
    handleSchoolCreated,
    handleSchoolUpdated,
    handleSchoolDeleted,
    handleImportCompleted,
    
    // Handlers de Diálogos
    handleNewSchool,
    handleEditSchool,
    handleSchoolSelected,
    handleSchoolDoubleClicked,
    handleOpenFilterDialog,
    handleOpenColumnsDialog,
    handleOpenImportDialog,
    
    // Handlers de Exportação
    handleExport,
    handleExportSelected,
    handleExportAllColumns,
    
    // Handlers de Dados
    handleDataChanged,
    handleSelectionChanged
  } = useSchoolsPageState()

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      <SchoolsHeader
        title={title}
        totalColumns={totalColumns}
        isLoadingColumns={isLoadingColumns}
        metricsSource={metricsSource as any}
        apiError={apiError?.message || null}
        onExport={handleExport}
        onExportSelected={handleExportSelected}
        onExportAllColumns={handleExportAllColumns}
        onOpenFilterDialog={handleOpenFilterDialog}
        onOpenColumnsDialog={handleOpenColumnsDialog}
        onOpenImportDialog={handleOpenImportDialog}
        onNewSchool={handleNewSchool}
        totalRowsCount={totalRowsCount}
        selectedRowsCount={selectedRowsCount}
        isLoading={isLoading}
      />

      <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SchoolsTableContainer 
          ref={tableRef}
          onDataChanged={handleDataChanged}
          onSchoolSelected={handleSchoolSelected}
          onSchoolDoubleClicked={handleSchoolDoubleClicked}
          onSelectionChanged={handleSelectionChanged}
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
        isFilterDialogOpen={dialogStates.isFilterDialogOpen}
        setFilterDialogOpen={(open) => setDialogStates(prev => ({ ...prev, isFilterDialogOpen: open }))}
        isColumnsDialogOpen={dialogStates.isColumnsDialogOpen}
        setColumnsDialogOpen={(open) => setDialogStates(prev => ({ ...prev, isColumnsDialogOpen: open }))}
        isImportDialogOpen={dialogStates.isImportDialogOpen}
        setImportDialogOpen={(open) => setDialogStates(prev => ({ ...prev, isImportDialogOpen: open }))}
        isSchoolFormOpen={dialogStates.isSchoolFormOpen}
        setSchoolFormOpen={(open) => setDialogStates(prev => ({ ...prev, isSchoolFormOpen: open }))}
        isSchoolDetailOpen={dialogStates.isSchoolDetailOpen}
        setSchoolDetailOpen={(open) => setDialogStates(prev => ({ ...prev, isSchoolDetailOpen: open }))}
        selectedSchool={selectedSchool}
        onSchoolCreated={handleSchoolCreated}
        onSchoolUpdated={handleSchoolUpdated}
        onSchoolDeleted={handleSchoolDeleted}
        onImportCompleted={handleImportCompleted}
      />
    </Box>
  )
} 