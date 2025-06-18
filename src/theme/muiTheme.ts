import { createTheme, ThemeOptions } from '@mui/material/styles'

const baseTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      main: '#0ea5e9',
      dark: '#0284c7',
      light: '#38bdf8',
      contrastText: '#ffffff',
    },
    secondary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      main: '#ef4444',
      dark: '#dc2626',
      light: '#f87171',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(15, 23, 42, 0.8)',
    },
    surface: {
      main: 'rgba(255, 255, 255, 0.05)',
      dark: 'rgba(0, 0, 0, 0.2)',
      light: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      disabled: '#64748b',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    action: {
      active: '#f8fafc',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(14, 165, 233, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#cbd5e1',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
}

export const darkTheme = createTheme({
  ...baseTheme,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          minHeight: '100vh',
          fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
        elevation1: {
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        },
        elevation2: {
          boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.35)',
        },
        elevation3: {
          boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.45)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          boxShadow: '0 4px 16px 0 rgba(14, 165, 233, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            boxShadow: '0 8px 24px 0 rgba(14, 165, 233, 0.6)',
          },
        },
        outlined: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(14, 165, 233, 0.5)',
          },
        },
        text: {
          '&:hover': {
            background: 'rgba(14, 165, 233, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #0ea5e9',
              boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
            },
            '& fieldset': {
              border: 'none',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#f8fafc',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(14, 165, 233, 0.05)',
          },
          '&.Mui-selected': {
            background: 'rgba(14, 165, 233, 0.1)',
            '&:hover': {
              background: 'rgba(14, 165, 233, 0.15)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#f8fafc',
        },
        filled: {
          background: 'rgba(14, 165, 233, 0.2)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
        },
      },
    },
  },
})

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string
      dark: string
      light: string
    }
  }

  interface PaletteOptions {
    surface?: {
      main: string
      dark: string
      light: string
    }
  }
} 