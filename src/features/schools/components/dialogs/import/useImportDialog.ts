import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useCsvImport } from '../../../hooks/useCsvJobs'
import { useCsvWebSocket } from '../../../hooks/useCsvWebSocket'
import { useAuthStore } from '@/stores/authStore'
import type { CsvProgressData } from './types'

interface UseImportDialogProps {
  onImportCompleted?: (() => void) | undefined
}

export const useImportDialog = ({ onImportCompleted }: UseImportDialogProps = {}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [progressData, setProgressData] = useState<CsvProgressData | null>(null)

  const accessToken = useAuthStore(state => state.accessToken)
  const csvImport = useCsvImport()
  
  const onProgressUpdate = useCallback((data: CsvProgressData) => {
    
    setProgressData(data)
    
    if (data.status === 'COMPLETED' && onImportCompleted) {
      
      onImportCompleted()
    }
  }, [onImportCompleted])

  const onWebSocketError = useCallback((_: string) => {
    
  }, [])

  const webSocketConfig = useMemo(() => ({
    accessToken: accessToken || '',
    onProgressUpdate,
    onError: onWebSocketError
  }), [accessToken, onProgressUpdate, onWebSocketError])
  
  const webSocket = useCsvWebSocket(webSocketConfig)

  useEffect(() => {
    if (jobId && webSocket.isConnected) {
      
      webSocket.subscribe(jobId)
    }
  }, [jobId, webSocket.isConnected, webSocket.subscribe])

  const handleStartImport = useCallback(() => {
    if (!selectedFile) {
      
      return
    }
    
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    
    csvImport.mutate(formData, {
      onSuccess: (response) => {
        
        setJobId(response.jobId)
        
        if (webSocket.isConnected) {
          webSocket.subscribe(response.jobId)
        }
      },
      onError: (_) => {
        
      }
    })
  }, [selectedFile, csvImport, webSocket])

  const handleCleanup = useCallback(() => {
    if (jobId) {
      
      webSocket.unsubscribe(jobId)
    }
    setJobId(null)
    setProgressData(null)
  }, [jobId, webSocket])

  const getButtonText = useCallback(() => {
    try {
      const isCompleted = progressData?.status === 'COMPLETED'
      
      if (jobId) {
        return isCompleted ? 'Concluído' : 'Importando...'
      }
      return 'Iniciar Importação'
    } catch (error) {
      
      return 'Iniciar Importação'
    }
  }, [jobId, progressData?.status])

  const isButtonDisabled = useCallback(() => {
    try {
      const isCompleted = progressData?.status === 'COMPLETED'
      const isUploading = csvImport.status === 'pending'
      
      return !selectedFile || isUploading || (!!jobId && !isCompleted) || !webSocket.isConnected
    } catch (error) {
      
      return true
    }
  }, [selectedFile, csvImport.status, jobId, progressData?.status, webSocket.isConnected])

  // Status computed values com valores padrão seguros
  const isCompleted = useMemo(() => {
    try {
      return progressData?.status === 'COMPLETED'
    } catch {
      return false
    }
  }, [progressData?.status])

  return {
    // State
    fileInputRef,
    selectedFile,
    setSelectedFile,
    jobId,
    progressData,
    
    // WebSocket
    webSocket: webSocket || {
      isConnected: false,
      error: null,
      subscribe: () => {},
      unsubscribe: () => {},
      disconnect: () => {},
      connectionType: null,
      connectionQuality: null,
      lastMessageTime: null
    },
    
    // Actions
    handleStartImport,
    handleCleanup,
    
    // UI helpers
    getButtonText,
    isButtonDisabled,
    
    // Status
    isCompleted
  }
} 