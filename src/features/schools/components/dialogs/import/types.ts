export interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onImportCompleted?: (() => void) | undefined
}

export type { CsvImportProgressData as CsvProgressData } from '../../../hooks/websocket/types' 