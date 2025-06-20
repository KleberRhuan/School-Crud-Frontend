import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogout } from '@/hooks/useAuth'
import { APP_CONFIG } from '../constants/layout'

export const useUserMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const isOpen = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: APP_CONFIG.routes.login, search: { redirect: undefined } })
      }
    })
  }

  const handleProfile = () => {
    handleClose()
    // TODO: Implementar navegação para página de perfil
    navigate({ to: APP_CONFIG.routes.profile })
  }

  const handleSettings = () => {
    handleClose()
    // TODO: Implementar navegação para página de configurações
    navigate({ to: APP_CONFIG.routes.settings })
  }

  return {
    anchorEl,
    isOpen,
    isLoggingOut: logoutMutation.isPending,
    handleOpen,
    handleClose,
    handleLogout,
    handleProfile,
    handleSettings,
  }
} 