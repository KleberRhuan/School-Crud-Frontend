import { Box, Container, Paper, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              p: 4,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: 'white'
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
              Bem-vindo ao sistema! Login realizado com sucesso.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
} 