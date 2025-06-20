// Constantes para o layout da aplicação
export const LAYOUT_CONSTANTS = {
  APP_BAR_HEIGHT: 64,
  ANIMATION_DURATION: 0.3,
  USER_MENU_MIN_WIDTH: 200,
  AVATAR_SIZE: 32,
} as const

export const LAYOUT_STYLES = {
  appBar: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  userAvatar: {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
  },
  glassPanelClass: 'glass-panel',
} as const

export const APP_CONFIG = {
  title: 'Data Dashboard',
  routes: {
    login: '/login',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
  },
} as const 