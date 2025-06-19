import './polyfills'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SentryProvider } from '@/providers/SentryProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { router } from './router'
import './index.css'
import './toast.css'
import {darkTheme} from "@/theme/muiTheme.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SentryProvider>
      <ErrorBoundary>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <ToastProvider>
            <QueryProvider>
              <RouterProvider router={router} />
            </QueryProvider>
          </ToastProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SentryProvider>
  </React.StrictMode>
) 