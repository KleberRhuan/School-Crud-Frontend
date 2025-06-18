import React, { ReactNode, useEffect } from 'react'
import { initSentry } from '@/utils/sentry'
import { useSentryUserContext } from '@/hooks/useSentry'

interface SentryProviderProps {
  children: ReactNode
}

export const SentryProvider: React.FC<SentryProviderProps> = ({ children }) => {
  useEffect(() => {
    initSentry()
  }, [])

  useSentryUserContext()
  
  return <>{children}</>
}

export default SentryProvider 