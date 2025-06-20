import type { ExportHandlerParams } from './types'

export const createExportHandlers = ({
  tableRef,
  toast,
  selectedRowsCount,
  totalRowsCount
}: ExportHandlerParams) => {
  const handleExport = () => {
    if (!tableRef.current || !tableRef.current.isGridReady) {
      toast.error('❌ Grid ainda não está pronto para exportação')
      return
    }

    const timestamp = new Date().toISOString().split('T')[0]
    const success = tableRef.current.exportVisiblePageToCsv(`escolas-pagina-visivel-${timestamp}.csv`)
    
    if (success) {
      toast.success(`✅ Página atual exportada com sucesso!`)
    } else {
      toast.error('❌ Erro ao exportar página atual. Tente novamente.')
    }
  }

  const handleExportSelected = () => {
    if (!tableRef.current || !tableRef.current.isGridReady) {
      toast.error('❌ Grid ainda não está pronto para exportação')
      return
    }

    if (selectedRowsCount === 0) {
      toast.warning('⚠️ Selecione pelo menos um registro para exportar')
      return
    }
    
    const timestamp = new Date().toISOString().split('T')[0]
    const success = tableRef.current.exportSelectedToCsv(`escolas-selecionadas-${timestamp}.csv`)
    
    if (success) {
      toast.success(`✅ Registros selecionados exportados! (${selectedRowsCount} registros)`)
    } else {
      toast.error('❌ Erro ao exportar registros selecionados')
    }
  }

  const handleExportAllColumns = () => {
    if (!tableRef.current || !tableRef.current.isGridReady) {
      toast.error('❌ Grid ainda não está pronto para exportação')
      return
    }

    const timestamp = new Date().toISOString().split('T')[0]
    const success = tableRef.current.exportAllColumnsToCsv(`escolas-completo-${timestamp}.csv`)
    
    if (success) {
      toast.success(`✅ Exportação completa concluída! (${totalRowsCount} registros, todas as colunas)`)
    } else {
      toast.error('❌ Erro ao exportar dados completos')
    }
  }

  return {
    handleExport,
    handleExportSelected,
    handleExportAllColumns
  }
} 