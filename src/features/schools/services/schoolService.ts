import type { AxiosInstance } from 'axios'
import type { 
  PageableRequest, 
  PaginatedResponse, 
  School, 
  SchoolCreateRequest, 
  SchoolFilters, 
  SchoolMetrics,
  SchoolUpdateRequest
} from '@/schemas/schoolSchemas'
import type { 
  CsvImportRequest, 
  CsvImportResponse 
} from '@/schemas/csvSchemas'

export class SchoolService {
  constructor(private readonly api: AxiosInstance) {}

  private buildPaginationParams(pageable: PageableRequest): URLSearchParams {
    const params = new URLSearchParams()
    params.append('page', String(pageable.page - 1))
    params.append('size', String(pageable.size))
    if (pageable.sort) {
      params.append('sort', `${pageable.sort},${pageable.direction}`)
    }
    return params
  }

  private addFilterParams(params: URLSearchParams, filters: SchoolFilters): void {
    if (filters.name) {
      params.append('name', filters.name)
    }
    if (filters.municipalityName) {
      params.append('municipalityName', filters.municipalityName)
    }
    if (filters.stateAbbreviation) {
      params.append('stateAbbreviation', filters.stateAbbreviation)
    }
    if (filters.operationalStatus !== undefined) {
      params.append('operationalStatus', String(filters.operationalStatus))
    }
    if (filters.dependencyType !== undefined) {
      params.append('dependencyType', String(filters.dependencyType))
    }
    if (filters.schoolType !== undefined) {
      params.append('schoolType', String(filters.schoolType))
    }
    if (filters.administrativeRegion) {
      params.append('administrativeRegion', filters.administrativeRegion)
    }
    if (filters.administrativeDependence) {
      params.append('administrativeDependence', filters.administrativeDependence)
    }
    if (filters.location) {
      params.append('location', filters.location)
    }
    if (filters.situation) {
      params.append('situation', filters.situation)
    }
  }

  async getAll(
    filters: SchoolFilters = {},
    pageable: PageableRequest = { page: 1, size: 20, direction: 'ASC' }
  ): Promise<PaginatedResponse<School>> {
    const params = this.buildPaginationParams(pageable)
    this.addFilterParams(params, filters)
    
    const response = await this.api.get<PaginatedResponse<School>>(`/schools?${params.toString()}`)
    return response.data
  }

  async getByCode(code: number): Promise<School> {
    const response = await this.api.get<School>(`/schools/${code}`)
    return response.data
  }

  async getMetrics(code: number): Promise<SchoolMetrics> {
    const response = await this.api.get<SchoolMetrics>(`/schools/${code}/metrics`)
    return response.data
  }

  async create(data: SchoolCreateRequest): Promise<School> {
    const response = await this.api.post<School>('/schools', data)
    return response.data
  }

  async update(code: number, data: SchoolUpdateRequest): Promise<School> {
    const response = await this.api.put<School>(`/schools/${code}`, data)
    return response.data
  }

  async delete(code: number): Promise<void> {
    await this.api.delete(`/schools/${code}`)
  }

  async importCsv(data: CsvImportRequest): Promise<CsvImportResponse> {
    const formData = new FormData()
    formData.append('file', data.file)

    const response = await this.api.post<CsvImportResponse>('/csv/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  async listUserJobs(pageable: PageableRequest = { page: 1, size: 20, direction: 'DESC' }): Promise<PaginatedResponse<CsvImportResponse>> {
    const response = await this.api.get<PaginatedResponse<CsvImportResponse>>('/csv/jobs', {
      params: pageable,
    })
    return response.data
  }

  async getJob(jobId: string): Promise<CsvImportResponse> {
    const response = await this.api.get<CsvImportResponse>(`/csv/jobs/${jobId}`)
    return response.data
  }

  async cancelJob(jobId: string): Promise<CsvImportResponse> {
    const response = await this.api.post<CsvImportResponse>(`/csv/jobs/${jobId}/cancel`)
    return response.data
  }

  async listJobsByStatus(
    status: string,
    pageable: PageableRequest = { page: 1, size: 20, direction: 'DESC' }
  ): Promise<PaginatedResponse<CsvImportResponse>> {
    const response = await this.api.get<PaginatedResponse<CsvImportResponse>>(`/csv/jobs/status/${status}`, {
      params: pageable,
    })
    return response.data
  }

  async listAllJobs(pageable: PageableRequest = { page: 1, size: 20, direction: 'DESC' }): Promise<PaginatedResponse<CsvImportResponse>> {
    const response = await this.api.get<PaginatedResponse<CsvImportResponse>>('/csv/jobs/all', {
      params: pageable,
    })
    return response.data
  }

  async getMetricsColumns(): Promise<string[]> {
    const response = await this.api.get<string[]>('/schools/metrics/columns')
    return response.data
  }

  async getColumnsDefinitions(): Promise<Array<{
    field: string
    label: string
    type: 'string' | 'number' | 'date' | 'boolean'
    category: 'basic' | 'metrics' | 'administrative'
    description?: string
  }>> {
    const response = await this.api.get('/schools/columns')
    return response.data
  }
}

export const createSchoolService = (api: AxiosInstance): SchoolService => {
  return new SchoolService(api)
} 