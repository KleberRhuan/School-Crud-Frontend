// Hooks principais para o SchoolsTable
export { useSchoolsGrid } from './useSchoolsGrid'
export { useSchoolsDatasource } from './useSchoolsDatasource'
export { useSchoolsEvents } from './useSchoolsEvents'
export { useSchoolsTableController } from './useSchoolsTableController'

export { useSchoolColumns } from './useSchoolColumns'
export { useCreateSchool, useUpdateSchool, useDeleteSchool } from './useSchoolMutations'
export { useSchoolsQuery } from './useSchoolsQuery'
export { useCsvWebSocket } from './useCsvWebSocket'

export type { 
  UseSchoolsGridReturn
} from './useSchoolsGrid'
export type { UseSchoolsDatasourceReturn as DatasourceHook } from './useSchoolsDatasource'
export type { UseSchoolsEventsReturn as EventsHook } from './useSchoolsEvents' 