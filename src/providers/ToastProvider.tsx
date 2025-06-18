import React from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: Readonly<ToastProviderProps>) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 5000,

          style: {
            background: 'transparent',
            padding: 0,
            boxShadow: 'none',
          },
          
          className: '',
          
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        }}
        reverseOrder={false}
      />
    </>
  );
} 