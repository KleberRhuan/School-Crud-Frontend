import React from 'react'
import { 
  Alert, 
  Box, 
  Button, 
  Container,
  Typography,
} from '@mui/material'
import { 
  BugReport,
  ErrorOutline,
  Home,
  Refresh
} from '@mui/icons-material'
import { motion } from 'framer-motion'

// === PROPS DO COMPONENTE UI ===
interface ErrorBoundaryUIProps {
  error: Error | null
  eventId: string | null
  onRetry: () => void
  onGoHome: () => void
  onReportBug: () => void
}

// === COMPONENTE DE UI DO ERROR BOUNDARY ===
export const ErrorBoundaryUI: React.FC<ErrorBoundaryUIProps> = ({
  error,
  eventId,
  onRetry,
  onGoHome,
  onReportBug,
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(198, 40, 40, 0.05) 100%)',
            border: '1px solid rgba(211, 47, 47, 0.2)',
          }}
        >
          {/* Ícone de erro */}
          <ErrorOutline 
            sx={{ 
              fontSize: 64, 
              color: 'error.main', 
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(211, 47, 47, 0.3))'
            }} 
          />

          {/* Título */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Algo deu errado
          </Typography>

          {/* Descrição */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Encontramos um erro inesperado. Nossa equipe foi notificada automaticamente.
          </Typography>

          {/* Detalhes do erro (apenas em desenvolvimento) */}
          {import.meta.env.DEV && error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Detalhes do erro (desenvolvimento):
              </Typography>
              <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                {error.message}
              </Typography>
            </Alert>
          )}

          {/* Event ID do Sentry */}
          {eventId && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
              ID do evento: {eventId}
            </Typography>
          )}

          {/* Botões de ação */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={onRetry}
              size="large"
            >
              Tentar novamente
            </Button>

            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={onGoHome}
              size="large"
            >
              Ir para início
            </Button>

            <Button
              variant="text"
              startIcon={<BugReport />}
              onClick={onReportBug}
              size="large"
              color="inherit"
            >
              Reportar problema
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Container>
  )
} 