import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'

interface MetricsVisibilityControlsProps {
  canShowMore: boolean
  canShowLess: boolean
  remainingCount: number
  visibleCount: number
  totalCount: number
  onShowMore: () => void
  onShowLess: () => void
}

export const MetricsVisibilityControls: React.FC<MetricsVisibilityControlsProps> = ({
  canShowMore,
  canShowLess,
  remainingCount,
  visibleCount,
  totalCount,
  onShowMore,
  onShowLess
}) => {
  if (!canShowMore && !canShowLess) {
    return null
  }

  return (
    <>
      {/* Controles de paginação */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
        {canShowLess && (
          <Button
            onClick={onShowLess}
            startIcon={<ExpandLess />}
            variant="outlined"
            color="primary"
            size="small"
          >
            Mostrar menos
          </Button>
        )}
        
        {canShowMore && (
          <Button
            onClick={onShowMore}
            startIcon={<ExpandMore />}
            variant="outlined"
            color="primary"
            size="small"
          >
            Mostrar mais 10 ({remainingCount} restantes)
          </Button>
        )}
      </Box>

      {/* Indicador de progresso */}
      {totalCount > 10 && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ textAlign: 'center', mt: 1 }}
        >
          Mostrando {visibleCount} de {totalCount} métricas
        </Typography>
      )}
    </>
  )
} 