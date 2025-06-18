import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Compiler for React 19
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]]
      }
    })
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@stores': resolve(__dirname, './src/stores'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@assets': resolve(__dirname, './src/assets')
    }
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': [
            '@tanstack/react-router',
            '@tanstack/react-query',
            '@tanstack/react-table',
            '@tanstack/react-virtual'
          ],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'utils-vendor': ['lodash-es', 'date-fns', 'classnames'],
          'csv-vendor': ['papaparse', 'dexie']
        }
      }
    },
    chunkSizeWarningLimit: 250 // 250kb warning limit as per requirements
  },
  server: {
    port: 3000,
    hmr: {
      overlay: true
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
      '@mui/material',
      'framer-motion'
    ]
  }
}) 