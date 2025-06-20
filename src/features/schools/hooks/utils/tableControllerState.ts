import { useRef, useState } from 'react'
import { GridApi } from 'ag-grid-community'
import type { TableControllerState } from './tableControllerTypes'

export const useTableControllerState = (): TableControllerState => {
  const gridApiRef = useRef<GridApi | null>(null)
  const [quickFilterText, setQuickFilterText] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isGridReady, setIsGridReady] = useState(false)

  return {
    gridApiRef,
    quickFilterText,
    isRefreshing,
    isGridReady,
    setQuickFilterText,
    setIsRefreshing,
    setIsGridReady
  }
} 