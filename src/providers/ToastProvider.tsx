import React from 'react';
import { closeSnackbar, SnackbarProvider } from 'notistack';
import { IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: Readonly<ToastProviderProps>) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={4000}
      dense={false}
      preventDuplicate={true}
      action={(snackbarKey) => (
        <IconButton
          size="small"
          color="inherit"
          onClick={() => closeSnackbar(snackbarKey)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  );
} 