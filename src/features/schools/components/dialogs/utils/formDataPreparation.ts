import type { School, SchoolCreateRequest, SchoolUpdateRequest } from '@/schemas/schoolSchemas'

export const prepareCreateData = (data: Partial<School>): SchoolCreateRequest => {
  return {
    code: Number(data.code!),
    schoolName: data.schoolName!,
    administrativeDependency: data.administrativeDependency,
    stateCode: data.stateCode,
    municipality: data.municipality,
    district: data.district,
    schoolType: data.schoolType ? Number(data.schoolType) : undefined,
    schoolTypeDescription: data.schoolTypeDescription,
    situationCode: data.situationCode ? Number(data.situationCode) : undefined,
    schoolCode: data.schoolCode ? Number(data.schoolCode) : undefined,
    metrics: data.metrics && Object.keys(data.metrics).length > 0 ? data.metrics as Record<string, number> : undefined
  }
}

export const prepareUpdateData = (data: Partial<School>): SchoolUpdateRequest => {
  return {
    schoolName: data.schoolName,
    administrativeDependency: data.administrativeDependency,
    stateCode: data.stateCode,
    municipality: data.municipality,
    district: data.district,
    schoolType: data.schoolType ? Number(data.schoolType) : undefined,
    schoolTypeDescription: data.schoolTypeDescription,
    situationCode: data.situationCode ? Number(data.situationCode) : undefined,
    schoolCode: data.schoolCode ? Number(data.schoolCode) : undefined,
    metrics: data.metrics && Object.keys(data.metrics).length > 0 ? data.metrics as Record<string, number> : undefined
  }
}

export const prepareFormDataFromSchool = (school: School): Partial<School> => {
  return {
    ...school,
    metrics: school.metrics?.metrics || {}
  }
} 