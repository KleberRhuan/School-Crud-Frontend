import React, { useCallback, useState } from 'react'
import {
  Box,
  Chip,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Download,
  FilterList,
  Refresh,
  ViewColumn,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import './DataTable.css'

interface DataTableProps<T = any> {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading?: boolean
  onRefresh?: () => void
  enableVirtualization?: boolean
  height?: string | number
  className?: string
}

export function DataTable<T = any>({
  data,
  columns,
  isLoading = false,
  onRefresh,
  enableVirtualization = true,
  height = '600px',
  className = '',
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null)

  // Configuração da tabela
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  })

  // Preparar dados para virtualização
  const { rows } = table.getRowModel()
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Configuração do virtualizador de linhas. Ele calcula apenas
  // os elementos visíveis no viewport, evitando renderizar todas
  // as linhas de uma vez.
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  })

  // Virtualização das colunas no cabeçalho. Útil para tabelas com
  // muitas colunas, garantindo scroll horizontal performático.
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: table.getVisibleFlatColumns().length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const column = table.getVisibleFlatColumns()[index]
      return column.getSize()
    },
    overscan: 5,
  })

  // Handlers
  const handleExport = useCallback(() => {
    // TODO: Implementar exportação CSV
    console.log('Exportar dados')
  }, [])

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColumnMenuAnchor(event.currentTarget)
  }

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget)
  }

  const virtualItems = enableVirtualization ? rowVirtualizer.getVirtualItems() : []
  const virtualColumns = enableVirtualization ? columnVirtualizer.getVirtualItems() : []

  return (
    <Paper 
      className={`data-table-container ${className}`}
      sx={{ 
        height, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <Toolbar 
        sx={{ 
          px: 2, 
          py: 1, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '64px !important',
        }}
      >
        <TextField
          size="small"
          placeholder="Pesquisar em todas as colunas..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          sx={{ 
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        />
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filtros">
            <IconButton onClick={handleFilterMenuOpen}>
              <FilterList />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Colunas">
            <IconButton onClick={handleColumnMenuOpen}>
              <ViewColumn />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Exportar CSV">
            <IconButton onClick={handleExport}>
              <Download />
            </IconButton>
          </Tooltip>
          
          {onRefresh && (
            <Tooltip title="Atualizar">
              <IconButton onClick={onRefresh} disabled={isLoading}>
                <Refresh className={isLoading ? 'animate-spin' : ''} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>

      {/* Stats */}
      <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip 
            label={`${rows.length} linhas`} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={`${table.getVisibleFlatColumns().length} colunas visíveis`} 
            size="small" 
            variant="outlined"
          />
          {globalFilter && (
            <Chip 
              label={`Filtrado: "${globalFilter}"`} 
              size="small" 
              color="primary"
              onDelete={() => setGlobalFilter('')}
            />
          )}
        </Box>
      </Box>

      {/* Table Container */}
      <Box
        ref={parentRef}
        className="table-scroll-container"
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {enableVirtualization ? (
          // Virtualized table
          <Box
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: `${columnVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {/* Virtual Headers */}
            <Box
              className="table-header"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                height: '48px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                borderBottom: '2px solid rgba(14, 165, 233, 0.3)',
              }}
            >
              {/* Renderiza apenas as colunas visíveis de forma virtualizada */}
              {virtualColumns.map((virtualColumn) => {
                const column = table.getVisibleFlatColumns()[virtualColumn.index]
                return (
                  <Box
                    key={column.id}
                    className="table-header-cell"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `${virtualColumn.start}px`,
                      width: `${virtualColumn.size}px`,
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={column.getToggleSortingHandler()}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {typeof column.columnDef.header === 'string' 
                        ? column.columnDef.header 
                        : column.id}
                    </Typography>
                    {column.getIsSorted() && (
                      <Box component="span" sx={{ ml: 1, fontSize: '0.75rem' }}>
                        {column.getIsSorted() === 'desc' ? '↓' : '↑'}
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>

            {/* Virtual Rows: cada item representa uma linha visível */}
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <motion.div
                  key={row.id}
                  className="table-row"
                  style={{
                    position: 'absolute',
                    top: `${virtualRow.start + 48}px`, // +48 for header
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    display: 'flex',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Cada coluna é renderizada na posição calculada pelo virtualizador */}
                  {virtualColumns.map((virtualColumn) => {
                    const cell = row.getVisibleCells()[virtualColumn.index]
                    return (
                      <Box
                        key={cell.id}
                        className="table-cell"
                        style={{
                          position: 'absolute',
                          left: `${virtualColumn.start}px`,
                          width: `${virtualColumn.size}px`,
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 12px',
                          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <Typography variant="body2" noWrap>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Typography>
                      </Box>
                    )
                  })}
                </motion.div>
              )
            })}
          </Box>
        ) : (
          // Standard table
          <table className="standard-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ 
                        width: header.getSize(),
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span>
                          {header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>

      {/* Column Visibility Menu */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
        PaperProps={{
          sx: { maxHeight: 400, width: 250 },
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Colunas Visíveis</Typography>
        </MenuItem>
        {table.getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <MenuItem key={column.id} dense>
              <FormControlLabel
                control={
                  <Switch
                    checked={column.getIsVisible()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      column.toggleVisibility(e.target.checked)
                    }
                  />
                }
                label={column.columnDef.header as string}
              />
            </MenuItem>
          ))}
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{
          sx: { minWidth: 300 },
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Filtros por Coluna</Typography>
        </MenuItem>
        {table.getHeaderGroups()[0]?.headers
          .filter((header) => header.column.getCanFilter())
          .map((header) => (
            <MenuItem key={header.id} dense>
              <TextField
                size="small"
                label={
                  typeof header.column.columnDef.header === 'string'
                    ? header.column.columnDef.header
                    : header.id
                }
                value={(header.column.getFilterValue() as string) ?? ''}
                onChange={(e) => header.column.setFilterValue(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </MenuItem>
          ))}
      </Menu>
    </Paper>
  )
} 