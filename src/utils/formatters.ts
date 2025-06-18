import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata valores para exibição na tabela
 * Otimizado para uso com useMemo
 */

export const formatValue = (value: any, type?: string): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  switch (type) {
    case 'date':
      return formatDate(value)
    case 'datetime':
      return formatDateTime(value)
    case 'time':
      return formatTime(value)
    case 'currency':
      return formatCurrency(value)
    case 'number':
      return formatNumber(value)
    case 'percentage':
      return formatPercentage(value)
    case 'boolean':
      return formatBoolean(value)
    case 'email':
      return formatEmail(value)
    case 'phone':
      return formatPhone(value)
    case 'cpf':
      return formatCPF(value)
    case 'cnpj':
      return formatCNPJ(value)
    default:
      return String(value)
  }
}

export const formatDate = (value: any): string => {
  if (!value) return '-'
  
  try {
    const date = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(date)) return String(value)
    
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return String(value)
  }
}

export const formatDateTime = (value: any): string => {
  if (!value) return '-'
  
  try {
    const date = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(date)) return String(value)
    
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
  } catch {
    return String(value)
  }
}

export const formatTime = (value: any): string => {
  if (!value) return '-'
  
  try {
    const date = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(date)) return String(value)
    
    return format(date, 'HH:mm:ss', { locale: ptBR })
  } catch {
    return String(value)
  }
}

export const formatCurrency = (value: any): string => {
  const num = parseFloat(value)
  if (isNaN(num)) return '-'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

export const formatNumber = (value: any): string => {
  const num = parseFloat(value)
  if (isNaN(num)) return '-'
  
  return new Intl.NumberFormat('pt-BR').format(num)
}

export const formatPercentage = (value: any): string => {
  const num = parseFloat(value)
  if (isNaN(num)) return '-'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(num / 100)
}

export const formatBoolean = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não'
  }
  
  const str = String(value).toLowerCase()
  if (str === 'true' || str === '1' || str === 'sim' || str === 'yes') {
    return 'Sim'
  }
  if (str === 'false' || str === '0' || str === 'não' || str === 'no') {
    return 'Não'
  }
  
  return String(value)
}

export const formatEmail = (value: any): string => {
  const email = String(value)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (emailRegex.test(email)) {
    return email.toLowerCase()
  }
  
  return email
}

export const formatPhone = (value: any): string => {
  const phone = String(value).replace(/\D/g, '')
  
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return String(value)
}

export const formatCPF = (value: any): string => {
  const cpf = String(value).replace(/\D/g, '')
  
  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  return String(value)
}

export const formatCNPJ = (value: any): string => {
  const cnpj = String(value).replace(/\D/g, '')
  
  if (cnpj.length === 14) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  
  return String(value)
}

/**
 * Trunca texto longo com reticências
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) {
    return text
  }
  
  return `${text.substring(0, maxLength)  }...`
}

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))  } ${  sizes[i]}`
}

/**
 * Formata duração em milissegundos
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } 
    return `${seconds}s`
  
}

/**
 * Detecta automaticamente o tipo de dados baseado no valor
 */
export const detectDataType = (value: any): string => {
  if (value === null || value === undefined) {
    return 'string'
  }
  
  const str = String(value)
  
  // Verifica se é um número
  if (!isNaN(Number(str)) && str.trim() !== '') {
    return 'number'
  }
  
  // Verifica se é uma data ISO
  if (str.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return 'datetime'
  }
  
  // Verifica se é uma data simples
  if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return 'date'
  }
  
  // Verifica se é um booleano
  if (str.toLowerCase() === 'true' || str.toLowerCase() === 'false') {
    return 'boolean'
  }
  
  // Verifica se é um email
  if (str.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return 'email'
  }
  
  // Verifica se é um telefone
  if (str.match(/^\(?[1-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$/)) {
    return 'phone'
  }
  
  // Verifica se é um CPF
  if (str.match(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)) {
    return 'cpf'
  }
  
  // Verifica se é um CNPJ
  if (str.match(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/)) {
    return 'cnpj'
  }
  
  return 'string'
}

/**
 * Cria um formatador memoizado para melhor performance
 */
export const createMemoizedFormatter = () => {
  const cache = new Map<string, string>()
  
  return (value: any, type?: string): string => {
    const key = `${String(value)}_${type || 'default'}`
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const formatted = formatValue(value, type)
    cache.set(key, formatted)
    
    // Limpar cache se ficar muito grande
    if (cache.size > 1000) {
      const keys = Array.from(cache.keys())
      keys.slice(0, 500).forEach(k => cache.delete(k))
    }
    
    return formatted
  }
} 