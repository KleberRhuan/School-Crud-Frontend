import React from 'react'
import { Box, LinearProgress } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import type { GridOptions } from 'ag-grid-community'

// Estilos do AG Grid
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

interface SchoolsTableViewProps {
  gridOptions: GridOptions
  onGridReady: (params: any) => void
  onPaginationChanged: (params: any) => void
  onSortChanged: (params: any) => void
  onFilterChanged: (params: any) => void
  onRowDataUpdated: (params: any) => void
  isLoading: boolean
  error: string | null
  className?: string
}

export const SchoolsTableView: React.FC<SchoolsTableViewProps> = ({
  gridOptions,
  onGridReady,
  onPaginationChanged,
  onSortChanged,
  onFilterChanged,
  onRowDataUpdated,
  isLoading,
  error,
  className = 'ag-theme-quartz-dark'
}) => {
  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Loading indicator */}
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            p: 1,
            zIndex: 1001,
            textAlign: 'center'
          }}
        >
          Erro ao carregar dados: {error}
        </Box>
      )}

      {/* AG Grid */}
      <Box 
        sx={{ 
          height: '100%', 
          width: '100%',
          // Customizações para o tema Quartz Dark
          '& .ag-theme-quartz-dark': {
            '--ag-background-color': 'rgba(15, 23, 42, 0.95)',
            '--ag-foreground-color': '#f8fafc',
            '--ag-border-color': 'rgba(255, 255, 255, 0.1)',
            '--ag-header-background-color': 'rgba(30, 41, 59, 0.8)',
            '--ag-header-foreground-color': '#f1f5f9',
            '--ag-row-hover-color': 'rgba(14, 165, 233, 0.1)',
            '--ag-selected-row-background-color': 'rgba(14, 165, 233, 0.2)',
            '--ag-odd-row-background-color': 'rgba(255, 255, 255, 0.02)',
            '--ag-even-row-background-color': 'transparent',
            '--ag-cell-horizontal-border': 'rgba(255, 255, 255, 0.08)',
            '--ag-font-size': '14px',
            '--ag-font-family': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            borderRadius: 0,
            overflow: 'hidden'
          },
          '& .ag-header': {
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '12px',
            letterSpacing: '0.5px',
            borderBottom: '2px solid rgba(14, 165, 233, 0.3)'
          },
          '& .ag-header-cell-label': {
            justifyContent: 'center'
          },
          '& .ag-row': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(14, 165, 233, 0.08)',
              transform: 'translateX(2px)',
              boxShadow: '2px 0 8px rgba(14, 165, 233, 0.1)',
              '& .ag-cell': {
                borderRightColor: 'rgba(14, 165, 233, 0.2)'
              }
            }
          },
          '& .ag-cell': {
            display: 'flex',
            alignItems: 'center',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            transition: 'border-color 0.2s ease'
          },
          '& .ag-paging-panel': {
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            borderTop: '2px solid rgba(14, 165, 233, 0.3)',
            color: '#f1f5f9',
            padding: '12px 16px'
          },
          '& .ag-paging-button': {
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            color: '#0ea5e9',
            borderRadius: '6px',
            padding: '6px 12px',
            margin: '0 2px',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(14, 165, 233, 0.2)',
              borderColor: 'rgba(14, 165, 233, 0.5)'
            },
            '&[disabled]': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          '& .ag-paging-page-summary-panel': {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }}
      >
        <AgGridReact
          {...gridOptions}
          className={className}
          onGridReady={onGridReady}
          onPaginationChanged={onPaginationChanged}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
          onRowDataUpdated={onRowDataUpdated}
        />
      </Box>
    </Box>
  )
} 