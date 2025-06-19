import { useCallback } from 'react'
import type { 
  CellEditingStoppedEvent,
  GridReadyEvent, 
  IDatasource,
  IServerSideDatasource,
  RowDoubleClickedEvent,
  RowSelectedEvent
} from 'ag-grid-community'

export interface UseSchoolsEventsProps {
  datasource?: IDatasource | null
  serverSideDatasource?: IServerSideDatasource | null
  onRowSelected?: ((school: any) => void) | undefined
  onRowDoubleClicked?: ((school: any) => void) | undefined
}

export interface UseSchoolsEventsReturn {
  onGridReady: (event: GridReadyEvent) => void
  onCellEditingStopped: (event: CellEditingStoppedEvent) => void
  onRowSelected: (event: RowSelectedEvent) => void
  onRowDoubleClicked: (event: RowDoubleClickedEvent) => void
}

export const useSchoolsEvents = ({
  datasource = null,
  serverSideDatasource = null,
  onRowSelected,
  onRowDoubleClicked
}: UseSchoolsEventsProps): UseSchoolsEventsReturn => {

  const handleGridReady = useCallback((event: GridReadyEvent) => {
    const { api } = event
    
    if (serverSideDatasource) {
      // @ts-expect-error - método existe em runtime na API do AG Grid
      api.setServerSideDatasource(serverSideDatasource)
    } else if (datasource) {
      api.setGridOption('datasource', datasource)
    }

    // Configurações iniciais
    api.sizeColumnsToFit()
  }, [datasource, serverSideDatasource])

  const handleCellEditingStopped = useCallback((event: CellEditingStoppedEvent) => {
    const { newValue, oldValue } = event
    
    if (newValue !== oldValue && process.env.NODE_ENV === 'development') {
      // Cell editing logging would go here in development
      // For production, only implement actual update logic
    }
    
    // Aqui você pode adicionar lógica para salvar as alterações
    // Por exemplo: updateSchool.mutate({ code: data.code, [field]: newValue })
  }, [])

  const handleRowSelected = useCallback((event: RowSelectedEvent) => {
    const { data, node } = event
    
    if (node.isSelected()) {
      if (process.env.NODE_ENV === 'development') {
        // Row selection logging would go here in development
      }
      onRowSelected?.(data)
    } else {
      onRowSelected?.(null)
    }
  }, [onRowSelected])

  const handleRowDoubleClicked = useCallback((event: RowDoubleClickedEvent) => {
    const { data } = event
    
    if (process.env.NODE_ENV === 'development') {
      // Double click logging would go here in development
    }
    
    onRowDoubleClicked?.(data)
  }, [onRowDoubleClicked])

  return {
    onGridReady: handleGridReady,
    onCellEditingStopped: handleCellEditingStopped,
    onRowSelected: handleRowSelected,
    onRowDoubleClicked: handleRowDoubleClicked
  }
} 