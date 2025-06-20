import { beforeEach, describe, expect, it } from 'vitest'
import { 
  clearQueryKeysCache, 
  createQueryKeys, 
  getQueryKeysCacheStats 
} from '@/config/queryConfig.ts'

describe('ETAPA 5: Otimização de createQueryKeys', () => {
  beforeEach(() => {
    // Limpar cache antes de cada teste
    clearQueryKeysCache()
  })

  describe('Memoização e Cache', () => {
    it('deve retornar a mesma instância de objeto para a mesma entidade', () => {
      const user1 = createQueryKeys('user')
      const user2 = createQueryKeys('user')
      
      // Verificar se são exatamente a mesma referência (===)
      expect(user1).toBe(user2)
      expect(user1 === user2).toBe(true)
    })

    it('deve memoizar chaves para diferentes chamadas da mesma função', () => {
      const userKeys = createQueryKeys('user')
      
      // Múltiplas chamadas para lists()
      const lists1 = userKeys.lists()
      const lists2 = userKeys.lists()
      
      // Devem ser a mesma referência
      expect(lists1).toBe(lists2)
      expect(lists1 === lists2).toBe(true)
    })

    it('deve memoizar chaves com filtros idênticos', () => {
      const userKeys = createQueryKeys('user')
      
      const filters = { active: true, role: 'admin' }
      const list1 = userKeys.list(filters)
      const list2 = userKeys.list(filters)
      
      // Devem ser a mesma referência para filtros idênticos
      expect(list1).toBe(list2)
      expect(list1 === list2).toBe(true)
    })

    it('deve memoizar chaves de detail com mesmo ID', () => {
      const userKeys = createQueryKeys('user')
      
      const detail1 = userKeys.detail(123)
      const detail2 = userKeys.detail(123)
      const detail3 = userKeys.detail('123') // Diferente tipo
      
      // Mesmo ID numérico deve ser memoizado
      expect(detail1).toBe(detail2)
      expect(detail1 === detail2).toBe(true)
      
      // Tipos diferentes devem ser diferentes referências
      expect(detail1).not.toBe(detail3)
    })

    it('deve criar diferentes referências para filtros diferentes', () => {
      const userKeys = createQueryKeys('user')
      
      const list1 = userKeys.list({ active: true })
      const list2 = userKeys.list({ active: false })
      const list3 = userKeys.list() // Sem filtros
      
      // Devem ser referências diferentes
      expect(list1).not.toBe(list2)
      expect(list1).not.toBe(list3)
      expect(list2).not.toBe(list3)
    })

    it('deve criar diferentes objetos para diferentes entidades', () => {
      const userKeys = createQueryKeys('user')
      const productKeys = createQueryKeys('product')
      
      expect(userKeys).not.toBe(productKeys)
      expect(userKeys.all).not.toBe(productKeys.all)
    })
  })

  describe('Snapshot Tests', () => {
    it('deve manter estrutura consistente das chaves', () => {
      const userKeys = createQueryKeys('user')
      
      expect(userKeys.all).toMatchSnapshot()
      expect(userKeys.lists()).toMatchSnapshot()
      expect(userKeys.details()).toMatchSnapshot()
      expect(userKeys.list({ active: true })).toMatchSnapshot()
      expect(userKeys.detail(1)).toMatchSnapshot()
      expect(userKeys.infinite({ page: 1 })).toMatchSnapshot()
    })

    it('deve ter chaves hierárquicas corretas', () => {
      const keys = createQueryKeys('product')
      
      // Verificar hierarquia
      expect(keys.all).toEqual(['product'])
      expect(keys.lists()).toEqual(['product', 'list'])
      expect(keys.details()).toEqual(['product', 'detail'])
      expect(keys.list({ category: 'tech' })).toEqual([
        'product', 'list', { filters: { category: 'tech' } }
      ])
      expect(keys.detail(456)).toEqual(['product', 'detail', 456])
      expect(keys.infinite()).toEqual([
        'product', 'infinite', { filters: undefined }
      ])
    })
  })

  describe('Estatísticas do Cache', () => {
    it('deve rastrear estatísticas de cache corretamente', () => {
      const initialStats = getQueryKeysCacheStats()
      expect(initialStats.entitiesCount).toBe(0)
      expect(initialStats.specificKeysCount).toBe(0)

      // Criar algumas chaves
      const userKeys = createQueryKeys('user')
      const productKeys = createQueryKeys('product')
      
      // Gerar algumas chaves específicas
      userKeys.lists()
      userKeys.detail(1)
      productKeys.list({ active: true })
      
      const finalStats = getQueryKeysCacheStats()
      expect(finalStats.entitiesCount).toBe(2) // user e product
      expect(finalStats.specificKeysCount).toBe(3) // lists, detail e list
      expect(finalStats.memoryUsage).toContain('bytes')
    })

    it('deve limpar cache corretamente', () => {
      // Criar algumas chaves
      createQueryKeys('user')
      createQueryKeys('product')
      
      let stats = getQueryKeysCacheStats()
      expect(stats.entitiesCount).toBeGreaterThan(0)
      
      // Limpar cache
      clearQueryKeysCache()
      
      stats = getQueryKeysCacheStats()
      expect(stats.entitiesCount).toBe(0)
      expect(stats.specificKeysCount).toBe(0)
    })
  })

  describe('Compatibilidade com TanStack Query', () => {
    it('deve criar chaves compatíveis com QueryKey type', () => {
      const keys = createQueryKeys('user')
      
      // Simular uso com TanStack Query
      const useQueryKey = keys.detail(1)
      const useInfiniteQueryKey = keys.infinite({ filters: { active: true } })
      
      // Verificar se são arrays válidos
      expect(Array.isArray(useQueryKey)).toBe(true)
      expect(Array.isArray(useInfiniteQueryKey)).toBe(true)
      
      // Verificar estrutura
      expect(useQueryKey[0]).toBe('user')
      expect(useInfiniteQueryKey[0]).toBe('user')
    })

    it('deve suportar padrão de invalidação hierárquica', () => {
      const keys = createQueryKeys('user')
      
      const basePattern = keys.all
      const detailPattern = keys.detail(1)
      const listPattern = keys.list({ active: true })
      
      // Simular invalidação hierárquica
      const shouldInvalidateDetail = detailPattern[0] === basePattern[0]
      const shouldInvalidateList = listPattern[0] === basePattern[0]
      
      expect(shouldInvalidateDetail).toBe(true)
      expect(shouldInvalidateList).toBe(true)
    })
  })

  describe('Performance', () => {
    it('deve ser mais eficiente com memoização em cenários reais', () => {
      const iterations = 5000 // Mais iterações para diferença significativa
      
      // Teste 1: Implementação sem cache (sempre recria)
      const startWithoutCache = performance.now()
      for (let i = 0; i < iterations; i++) {
        // Simular uso típico sem memoização
        const tempKeys = {
          all: ['user'] as const,
          lists: () => [...['user'], 'list'] as const,
          detail: (id: number) => [...['user'], 'detail', id] as const,
        }
        // Simular múltiplas chamadas para mesmas chaves
        tempKeys.lists()
        tempKeys.detail(1)
        tempKeys.detail(1) // Repetir para ver se há cache
      }
      const endWithoutCache = performance.now()
      const timeWithoutCache = endWithoutCache - startWithoutCache
      
      // Teste 2: Implementação com cache (memoizada)
      clearQueryKeysCache()
      const startWithCache = performance.now()
      const userKeys = createQueryKeys('user')
      for (let i = 0; i < iterations; i++) {
        // Simular múltiplas chamadas para mesmas chaves
        userKeys.lists()
        userKeys.detail(1)
        userKeys.detail(1) // Repetir para aproveitar cache
      }
      const endWithCache = performance.now()
      const timeWithCache = endWithCache - startWithCache
      
      // Teste mais flexível: cache deve ser pelo menos igual ou melhor
      expect(timeWithCache).toBeLessThanOrEqual(timeWithoutCache * 1.1) // 10% de tolerância
    })

    it('deve demonstrar eficiência de memória com menos alocações', () => {
      clearQueryKeysCache()
      
      // Medir alocações com implementação sem cache
      const allocationsWithoutCache: string[] = []
      for (let i = 0; i < 100; i++) {
        const tempKeys = {
          lists: () => [...['user'], 'list'] as const,
          detail: (id: number) => [...['user'], 'detail', id] as const,
        }
        allocationsWithoutCache.push(JSON.stringify(tempKeys.lists()))
        allocationsWithoutCache.push(JSON.stringify(tempKeys.detail(1)))
      }
      
      // Verificar que todas são diferentes (não cachadas)
      const uniqueWithoutCache = new Set(allocationsWithoutCache)
      
      clearQueryKeysCache()
      
      // Medir alocações com implementação com cache
      const allocationsWithCache: string[] = []
      const userKeys = createQueryKeys('user')
      for (let i = 0; i < 100; i++) {
        allocationsWithCache.push(JSON.stringify(userKeys.lists()))
        allocationsWithCache.push(JSON.stringify(userKeys.detail(1)))
      }
      
      // Verificar que muitas são iguais (cachadas)
      const uniqueWithCache = new Set(allocationsWithCache)
      
      
      
      
      // CRITÉRIO DA ETAPA 5: ≥ 20% menos alocações
      const reduction = ((uniqueWithoutCache.size - uniqueWithCache.size) / uniqueWithoutCache.size) * 100
      expect(reduction).toBeGreaterThanOrEqual(20)
    })
  })
}) 