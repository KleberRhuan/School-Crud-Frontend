import { useMemo } from 'react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useColumnPreferences } from '../store/columnPreferences'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useAuthStore } from '@/stores/authStore'
import { 
  CACHE_TIME_HOUR, 
  CACHE_TIME_LONG, 
  DEFAULT_COLUMN_WIDTH, 
  EXTRA_WIDE_COLUMN_WIDTH,
  NARROW_COLUMN_WIDTH,
  WIDE_COLUMN_WIDTH
} from '@/constants/pagination'

interface ColumnDefinition {
  field: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean'
  category: 'basic' | 'metrics' | 'administrative'
  description?: string
  width?: number
  pinned?: 'left' | 'right'
  required?: boolean
}

// Minimal fallback apenas para casos extremos de erro na API
const minimalFallbackColumns: ColumnDefinition[] = [
  {
    field: 'code',
    label: 'Código',
    type: 'number',
    category: 'basic',
    width: DEFAULT_COLUMN_WIDTH,
    pinned: 'left'
  },
  {
    field: 'schoolName',
    label: 'Nome da Escola',
    type: 'string',
    category: 'basic',
    width: EXTRA_WIDE_COLUMN_WIDTH,
    pinned: 'left'
  },
  {
    field: 'municipality',
    label: 'Município',
    type: 'string',
    category: 'basic',
    width: WIDE_COLUMN_WIDTH
  },
  {
    field: 'stateCode',
    label: 'UF',
    type: 'string',
    category: 'basic',
    width: NARROW_COLUMN_WIDTH
  }
]

// Hook para buscar lista de métricas disponíveis
const useMetricsList = () => {
  const accessToken = useAuthStore(state => state.accessToken)

  const query = useApiQuery<string[]>(
    ['school-metrics-list'],
    '/schools/metrics',
    {},
    {
      staleTime: CACHE_TIME_LONG,
      gcTime: CACHE_TIME_HOUR,
      retry: 2,
      enabled: !!accessToken,
    }
  )

  return query
}

// Função para criar cell renderer baseado no tipo da coluna
const createCellRenderer = (columnDef: ColumnDefinition) => {
  return (params: ICellRendererParams) => {
    const { value } = params

    if (value === null || value === undefined) {
      if (columnDef.category === 'metrics') {
        return '-'
      }
      return ''
    }

    switch (columnDef.type) {
      case 'number':
        if (columnDef.category === 'metrics') {
          return typeof value === 'number' ? value.toLocaleString('pt-BR') : value
        }
        return value.toString()

      case 'date':
        try {
          return new Date(value).toLocaleDateString('pt-BR')
        } catch {
          return value.toString()
        }

      case 'boolean':
        return value ? 'Sim' : 'Não'

      case 'string':
      default:
        return value.toString()
    }
  }
}

const getFilterType = (columnDef: ColumnDefinition): string => {
  switch (columnDef.type) {
    case 'number':
      return 'agNumberColumnFilter'
    case 'date':
      return 'agDateColumnFilter'
    case 'boolean':
      return 'agBooleanColumnFilter'
    case 'string':
    default:
      return 'agTextColumnFilter'
  }
}

const generateColumnsFromDefinitions = (definitions: ColumnDefinition[]): ColDef[] => {
  return definitions.map((columnDef): ColDef => {
    const baseColDef: ColDef = {
      field: columnDef.category === 'metrics' ? `metrics.${columnDef.field}` : columnDef.field,
      headerName: columnDef.label,
      width: columnDef.width || DEFAULT_COLUMN_WIDTH,
      pinned: columnDef.pinned || null,
      sortable: true,
      filter: getFilterType(columnDef),
      resizable: true,
      editable: columnDef.category !== 'metrics',
      cellRenderer: createCellRenderer(columnDef),
      headerTooltip: columnDef.description || columnDef.label,
    }

    if (!columnDef.description) {
      baseColDef.tooltipField = columnDef.field
    }

    if (columnDef.category === 'metrics') {
      baseColDef.valueGetter = (params: any) => {

        const metricsData = params.data?.metrics?.metrics
        const metricsValue = metricsData?.[columnDef.field]
        
        return metricsValue !== undefined ? metricsValue : undefined
      }
    }

    return baseColDef
  })
}

export const useSchoolColumns = () => {
  const { applyPreferencesToColumns } = useColumnPreferences()
  const { data: metricsList, isLoading, error } = useMetricsList()

  const { columns, totalColumns, dataSource } = useMemo(() => {
    const basicDefinitions: ColumnDefinition[] = minimalFallbackColumns

    const metricDefinitions: ColumnDefinition[] = (metricsList || []).map((metric) => ({
      field: metric,
      label: metric.replace(/_/g, ' '),
      type: 'number',
      category: 'metrics',
      width: DEFAULT_COLUMN_WIDTH,
    }))

    const definitionsToUse = [...basicDefinitions, ...metricDefinitions]

    const generatedColumns = generateColumnsFromDefinitions(definitionsToUse)

    const finalColumns = applyPreferencesToColumns(generatedColumns)

    return {
      columns: finalColumns,
      totalColumns: definitionsToUse.length,
      dataSource: metricsList ? 'api' : 'fallback',
    }
  }, [applyPreferencesToColumns, metricsList])

  const defaultColDef = useMemo((): ColDef => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: false,
    minWidth: NARROW_COLUMN_WIDTH,
    flex: 0,
    cellStyle: { textAlign: 'left' },
    headerClass: 'ag-header-custom',
  }), [])

  return {
    columns,
    defaultColDef,
    totalColumns,
    isLoadingColumns: isLoading,
    metricsSource: dataSource,
    apiError: error,
    hasApiData: !!metricsList && metricsList.length > 0,
    columnsByCategory: useMemo(() => ({
      basic: minimalFallbackColumns.length,
      metrics: (metricsList || []).length,
      administrative: 0,
    }), [metricsList])
  }
}