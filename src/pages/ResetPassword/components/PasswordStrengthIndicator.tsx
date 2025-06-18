
import { Alert, Box, Chip, Collapse, LinearProgress, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { usePasswordStrength } from "@hooks/usePasswordStrength.ts"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

interface PasswordStrengthIndicatorProps {
  password: string
  showDetails?: boolean
  showCrackTime?: boolean
  showFeedback?: boolean
  compact?: boolean
}

export function PasswordStrengthIndicator({
                                            password,
                                            showDetails = true,
                                            showCrackTime = true,
                                            showFeedback = false,
                                            compact = false
                                          }: Readonly<PasswordStrengthIndicatorProps>) {
  const passwordStrength = usePasswordStrength(password)
  const [showAllFeedback, setShowAllFeedback] = useState(false)

  if (!password) return null

  const getProgressHeight = () => compact ? 4 : 6
  const getIconForFeedback = (feedback: string) => {
    if (feedback.startsWith('✓')) return <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: 'success.main' }} />
    if (feedback.startsWith('⚠')) return <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: 'warning.main' }} />
    return <InfoOutlinedIcon sx={{ fontSize: 14, color: 'info.main' }} />
  }

  return (
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Box sx={{ mb: compact ? 1 : 2 }}>
            {/* Header com label e informações */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Força da senha
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {showCrackTime && (
                    <Chip
                        label={`${passwordStrength.getCrackTimeIcon()} ${passwordStrength.estimatedCrackTime}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 10, height: 20 }}
                    />
                )}

                <Typography
                    variant="caption"
                    color={`${passwordStrength.color}.main`}
                    fontWeight="medium"
                >
                  {passwordStrength.label}
                </Typography>

                {showDetails && (
                    <Typography variant="caption" color="text.disabled">
                      ({passwordStrength.getScoreText()})
                    </Typography>
                )}
              </Box>
            </Box>

            {/* Barra de progresso */}
            <LinearProgress
                variant="determinate"
                value={passwordStrength.percentage}
                color={passwordStrength.color}
                sx={{
                  height: getProgressHeight(),
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    transition: 'transform 0.4s ease-in-out'
                  }
                }}
            />

            {/* Detalhes e feedback */}
            {showDetails && !compact && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Box sx={{ mt: 1.5 }}>
                    {/* Feedback positivo */}
                    {passwordStrength.feedback.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          {passwordStrength.feedback.slice(0, showAllFeedback ? undefined : 3).map((item, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                {getIconForFeedback(item)}
                                <Typography variant="caption" color="text.secondary">
                                  {item}
                                </Typography>
                              </Box>
                          ))}

                          {passwordStrength.feedback.length > 3 && !showAllFeedback && (
                              <Typography
                                  variant="caption"
                                  color="primary.main"
                                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                  onClick={() => setShowAllFeedback(true)}
                              >
                                Ver mais ({passwordStrength.feedback.length - 3})
                              </Typography>
                          )}
                        </Box>
                    )}

                    {/* Sugestões de melhoria */}
                    {showFeedback && passwordStrength.suggestions.length > 0 && (
                        <Collapse in={passwordStrength.suggestions.length > 0}>
                          <Alert
                              severity="info"
                              sx={{
                                mt: 1,
                                py: 0.5,
                                '& .MuiAlert-message': { fontSize: 12 }
                              }}
                          >
                            <Typography variant="caption" fontWeight="medium" sx={{ mb: 0.5, display: 'block' }}>
                              Para melhorar sua senha:
                            </Typography>
                            {passwordStrength.suggestions.slice(0, 3).map((suggestion, index) => (
                                <Typography key={index} variant="caption" component="div" color="text.secondary">
                                  • {suggestion}
                                </Typography>
                            ))}
                          </Alert>
                        </Collapse>
                    )}
                  </Box>
                </motion.div>
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
  )
}