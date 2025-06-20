import { useCallback, useRef } from 'react'
import type { CsvImportProgressData } from './types'
import { globalStompClient } from './connectionManager'

const messageCache = new Map<string, string>()
const CACHE_SIZE_LIMIT = 100

const addToCache = (key: string, value: string) => {
  if (messageCache.size >= CACHE_SIZE_LIMIT) {
    const firstKey = messageCache.keys().next().value
    if (firstKey) {
      messageCache.delete(firstKey)
    }
  }
  messageCache.set(key, value)
}

const isMessageCached = (key: string, value: string): boolean => {
  return messageCache.get(key) === value
}

export const useCleanupResources = () => {
  const subscriptionsRef = useRef<Map<string, any>>(new Map())
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const cleanup = useCallback(() => {
    for (const [_, subscription] of subscriptionsRef.current) {
      try {
        subscription.unsubscribe()
      } catch (_) {}
    }
    
    subscriptionsRef.current.clear()
    messageCache.clear()
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  return { subscriptionsRef, reconnectTimeoutRef, cleanup }
}

export const useJobSubscription = (
  subscriptionsRef: React.RefObject<Map<string, any>>,
  onProgressUpdate?: (data: CsvImportProgressData) => void,
  setLastMessageTime?: (date: Date) => void,
  updateHeartbeat?: () => void
) => {
  const lastProcessedMessageRef = useRef<Map<string, number>>(new Map())

  const subscribeToJob = useCallback((jobId: string) => {
    if (!globalStompClient?.connected) {
      
      return
    }

    if (subscriptionsRef.current.has(jobId)) {
      
      return
    }

    
    
    const subscription = globalStompClient.subscribe(
      `/topic/csv-import/${jobId}`,
      (message) => {
        const messageTime = Date.now()
        const messageBody = message.body
        const cacheKey = `${jobId}-${messageTime}`
        
        if (isMessageCached(cacheKey, messageBody)) {
          
          return
        }

        const lastProcessedTime = lastProcessedMessageRef.current.get(jobId) || 0
        if (messageTime <= lastProcessedTime) {
          
          return
        }

        try {
          const progressData: CsvImportProgressData = JSON.parse(messageBody)
        
          addToCache(cacheKey, messageBody)
          lastProcessedMessageRef.current.set(jobId, messageTime)
          
          
          
          setLastMessageTime?.(new Date())
          updateHeartbeat?.()
          onProgressUpdate?.(progressData)
          
        } catch (error) {
          
        }
      }
    )

    subscriptionsRef.current?.set(jobId, subscription)
  }, [subscriptionsRef, onProgressUpdate, setLastMessageTime, updateHeartbeat])

  const unsubscribeFromJob = useCallback((jobId: string) => {
    const subscription = subscriptionsRef.current?.get(jobId)
    if (subscription) {
      
      subscription.unsubscribe()
      subscriptionsRef.current?.delete(jobId)
      lastProcessedMessageRef.current.delete(jobId)
      
      for (const [key] of messageCache) {
        if (key.startsWith(`${jobId}-`)) {
          messageCache.delete(key)
        }
      }
    }
  }, [subscriptionsRef])

  return { subscribeToJob, unsubscribeFromJob }
} 