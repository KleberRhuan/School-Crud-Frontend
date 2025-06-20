import { Box } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { AppHeader, UserMenu, MainContent } from './components'
import { useUserMenu } from './hooks/useUserMenu'

/**
 * Layout principal da aplicação
 * Responsável por renderizar o cabeçalho (quando autenticado) e o conteúdo principal
 */
export function RootLayout() {
  const { user, isAuthenticated } = useAuth()
  const userMenu = useUserMenu()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar - apenas quando autenticado */}
      <AnimatePresence>
        {isAuthenticated && (
          <AppHeader 
            user={user} 
            onAvatarClick={userMenu.handleOpen}
          />
        )}
      </AnimatePresence>

      {/* User Menu */}
      <UserMenu
        anchorEl={userMenu.anchorEl}
        isOpen={userMenu.isOpen}
        isLoggingOut={userMenu.isLoggingOut}
        onClose={userMenu.handleClose}
        onProfile={userMenu.handleProfile}
        onSettings={userMenu.handleSettings}
        onLogout={userMenu.handleLogout}
      />

      {/* Main Content */}
      <MainContent isAuthenticated={isAuthenticated} />
    </Box>
  )
} 