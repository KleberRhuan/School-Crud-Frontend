import React, { createContext, ReactNode, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createAppQueryClient } from '@/lib/query-config'

export interface QueryStatsContextType {
  getStats: () => {
    queries: number
    mutations: number
    isFetching: number
    cacheSize: string
  }
  logStats: () => void
  clearAllCache: () => void
}

export const QueryStatsContext = createContext<QueryStatsContextType | null>(null)

/**
 * Provider de estatísticas do Query (simplificado)
 */
const QueryStatsProvider: React.FC<{ 
  queryClient: QueryClient
  children: ReactNode 
}> = ({ queryClient, children }) => {
  

  const contextValue = useMemo<QueryStatsContextType>(() => ({
    getStats: () => {
      const cache = queryClient.getQueryCache()
      const mutations = queryClient.getMutationCache()
      
      return {
        queries: cache.getAll().length,
        mutations: mutations.getAll().length,
        isFetching: cache.getAll().filter(query => query.state.fetchStatus === 'fetching').length,
        cacheSize: `${JSON.stringify(cache.getAll()).length} bytes`,
      }
    },

    logStats: () => {
      const cache = queryClient.getQueryCache()
      const mutations = queryClient.getMutationCache()
      const stats = {
        queries: cache.getAll().length,
        mutations: mutations.getAll().length,
        isFetching: cache.getAll().filter(query => query.state.fetchStatus === 'fetching').length,
        cacheSize: `${JSON.stringify(cache.getAll()).length} bytes`,
      }
      console.log('📊 [QueryStats] Estatísticas do cache:', stats)
    },

    clearAllCache: () => {
      queryClient.clear()
    },
  }), [queryClient])

  return (
    <QueryStatsContext.Provider value={contextValue}>
      {children}
    </QueryStatsContext.Provider>
  )
}

/**
 * Provider principal do TanStack Query
 * Refatorado para remover QueryAuthIntegration (agora no useAuth)
 */
interface QueryProviderProps {
  children: ReactNode
  client?: QueryClient
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ 
  children, 
  client 
}) => {
  
  const queryClient = client || createAppQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <QueryStatsProvider queryClient={queryClient}>
        {children}
        
        {/* DevTools apenas em desenvolvimento */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools 
            initialIsOpen={false}
            buttonPosition="bottom-right"
          />
        )}
      </QueryStatsProvider>
    </QueryClientProvider>
  )
}
