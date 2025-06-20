export { useSchoolsTableController } from './useSchoolsTableController'
export { useGridExport } from './export/useGridExport'
export { useGridEventHandlers } from './grid/useGridEventHandlers'

export type { UseSchoolsTableControllerProps, ExportOptions } from './types/tableController.types'

export { useSchoolsGrid } from './useSchoolsGrid'
export { useSchoolsEvents } from './useSchoolsEvents'
export { useSchoolColumns } from './useSchoolColumns'

export { useSchoolsDatasource } from './useSchoolsDatasource'
export { useCreateSchool, useUpdateSchool, useDeleteSchool } from './useSchoolMutations'
export { useSchoolsQuery } from './useSchoolsQuery'
export { useCsvWebSocket } from './useCsvWebSocket'

export type { 
  UseSchoolsGridReturn
} from './useSchoolsGrid'
export type { UseSchoolsDatasourceReturn as DatasourceHook } from './useSchoolsDatasource'
export type { UseSchoolsEventsReturn as EventsHook } from './useSchoolsEvents' 