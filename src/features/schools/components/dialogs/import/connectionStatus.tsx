import React from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import WifiIcon from '@mui/icons-material/Wifi'
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import type { ConnectionQuality, ConnectionType } from '../../../hooks/websocket/types'

interface ConnectionStatusProps {
  isConnected: boolean
  connectionType: ConnectionType
  connectionQuality: ConnectionQuality
  lastMessageTime: Date | null
  error: string | null
}

// Constantes para timeouts de formatação
const TIME_CONSTANTS = {
  SECONDS_IN_MINUTE: 60,
  SECONDS_IN_HOUR: 3600,
  MINUTES_IN_HOUR: 60,
  MILLISECONDS_IN_SECOND: 1000
} as const

const getConnectionStatusColor = (isConnected: boolean, connectionType: ConnectionType, connectionQuality: ConnectionQuality) => {
  if (!isConnected) return 'error'
  if (connectionType === 'native') {
    switch (connectionQuality) {
      case 'excellent': return 'success'
      case 'good': return 'info' 
      case 'poor': return 'warning'
      default: return 'default'
    }
  }
  if (connectionType === 'sockjs') return 'warning'
  return 'default'
}

const getConnectionStatusText = (isConnected: boolean, connectionType: ConnectionType, connectionQuality: ConnectionQuality) => {
  if (!isConnected) return 'Desconectado'
  
  const baseText = connectionType === 'native' ? 'WebSocket Nativo' : 'SockJS (Fallback)'
  
  if (connectionQuality && isConnected) {
    const qualityText = {
      'excellent': '🟢 Excelente',
      'good': '🟡 Boa', 
      'poor': '🔴 Ruim',
      'disconnected': '⚫ Desconectado'
    }[connectionQuality]
    
    return `${baseText} - ${qualityText}`
  }
  
  return baseText
}

const getConnectionIcon = (isConnected: boolean, connectionQuality: ConnectionQuality) => {
  if (!isConnected) return <SignalWifiOffIcon fontSize="small" />
  if (connectionQuality === 'excellent') return <NetworkCheckIcon fontSize="small" />
  return <WifiIcon fontSize="small" />
}

const formatLastMessageTime = (lastMessageTime: Date | null) => {
  if (!lastMessageTime) return null
  
  const now = new Date()
  const diffMs = now.getTime() - lastMessageTime.getTime()
  const diffSec = Math.floor(diffMs / TIME_CONSTANTS.MILLISECONDS_IN_SECOND)
  
  if (diffSec < TIME_CONSTANTS.SECONDS_IN_MINUTE) return `${diffSec}s atrás`
  if (diffSec < TIME_CONSTANTS.SECONDS_IN_HOUR) return `${Math.floor(diffSec / TIME_CONSTANTS.MINUTES_IN_HOUR)}min atrás`
  return lastMessageTime.toLocaleTimeString()
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  connectionType,
  connectionQuality,
  lastMessageTime,
  error
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        {getConnectionIcon(isConnected, connectionQuality)}
        <Chip 
          label={getConnectionStatusText(isConnected, connectionType, connectionQuality)}
          color={getConnectionStatusColor(isConnected, connectionType, connectionQuality)}
          variant="outlined"
          size="small"
        />
      </Stack>
      
      {lastMessageTime && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
          Última mensagem: {formatLastMessageTime(lastMessageTime)}
        </Typography>
      )}
      
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', ml: 3 }}>
          ⚠️ {error}
        </Typography>
      )}
    </Box>
  )
} 