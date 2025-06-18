/**
 * Configurações padrão para React Query
 */
export class DefaultQueryConfig {
  public static readonly STALE_TIME = 1000 * 60 * 5 // 5 minutos
  public static readonly GC_TIME = 1000 * 60 * 10 // 10 minutos
  public static readonly MAX_RETRIES = 3
  public static readonly RATE_LIMIT_RETRIES = 2
}

/**
 * Interface para query keys estruturadas
 */
interface QueryKeys {
  readonly all: readonly string[]
  readonly lists: () => readonly string[]
  readonly list: (filters?: Record<string, any>) => readonly (string | Record<string, any>)[]
  readonly details: () => readonly string[]
  readonly detail: (id: string | number) => readonly (string | number)[]
  readonly infinite: (filters?: Record<string, any>) => readonly (string | Record<string, any>)[]
}

/**
 * Cache para query keys memoizadas
 */
const entityCache = new Map<string, QueryKeys>()
const keysCache = new Map<string, readonly any[]>()

/**
 * Utilitário para criar chave de cache com diferenciação de tipos
 */
const createCacheKey = (entity: string, type: string, value?: any): string => {
  if (value === undefined || value === null) {
    return `${entity}:${type}`
  }
  
  if (typeof value === 'object') {
    return `${entity}:${type}:obj:${JSON.stringify(value)}`
  }

  return `${entity}:${type}:${typeof value}:${value}`
}

/**
 * Utilitário para criar chaves de query consistentes
 */
export const createQueryKeys = (entity: string): QueryKeys => {
  if (entityCache.has(entity)) {
    return entityCache.get(entity)!
  }

  const allKey = [entity] as const
  const listsKey = [...allKey, 'list'] as const
  const detailsKey = [...allKey, 'detail'] as const

  const queryKeys: QueryKeys = {
    all: allKey,
    
    lists: () => {
      const cacheKey = createCacheKey(entity, 'lists')
      if (!keysCache.has(cacheKey)) {
        keysCache.set(cacheKey, listsKey)
      }
      return keysCache.get(cacheKey)! as readonly string[]
    },
    
    list: (filters?: Record<string, any>) => {
      const cacheKey = createCacheKey(entity, 'list', filters)
      if (!keysCache.has(cacheKey)) {
        keysCache.set(cacheKey, [...listsKey, { filters }] as const)
      }
      return keysCache.get(cacheKey)! as readonly (string | Record<string, any>)[]
    },
    
    details: () => {
      const cacheKey = createCacheKey(entity, 'details')
      if (!keysCache.has(cacheKey)) {
        keysCache.set(cacheKey, detailsKey)
      }
      return keysCache.get(cacheKey)! as readonly string[]
    },
    
    detail: (id: string | number) => {
      const cacheKey = createCacheKey(entity, 'detail', id)
      if (!keysCache.has(cacheKey)) {
        keysCache.set(cacheKey, [...detailsKey, id] as const)
      }
      return keysCache.get(cacheKey)! as readonly (string | number)[]
    },
    
    infinite: (filters?: Record<string, any>) => {
      const cacheKey = createCacheKey(entity, 'infinite', filters)
      if (!keysCache.has(cacheKey)) {
        keysCache.set(cacheKey, [...allKey, 'infinite', { filters }] as const)
      }
      return keysCache.get(cacheKey)! as readonly (string | Record<string, any>)[]
    },
  }

  entityCache.set(entity, queryKeys)
  return queryKeys
}

/**
 * Utilitário para limpar cache
 */
export const clearQueryKeysCache = () => {
  entityCache.clear()
  keysCache.clear()
}

/**
 * Utilitário para obter estatísticas do cache
 */
export const getQueryKeysCacheStats = () => ({
  entitiesCount: entityCache.size,
  specificKeysCount: keysCache.size,
  memoryUsage: `${JSON.stringify([...entityCache.keys()]).length + JSON.stringify([...keysCache.keys()]).length} bytes`,
}) 