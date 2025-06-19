/* Polyfills globais para bibliotecas Node em ambiente browser */

// Garantir variável global
if (typeof global === 'undefined' && typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.global = window
} 

// Registrar módulos do AG Grid
import './agGridSetup' 