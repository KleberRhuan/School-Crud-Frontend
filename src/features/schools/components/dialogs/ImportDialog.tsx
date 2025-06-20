import React from 'react'
import { Button, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { 
  ConnectionStatus,
  FileUpload,
  type ImportDialogProps,
  ProgressDisplay,
  useImportDialog
} from './import'

export const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose, onImportCompleted }) => {
  const {
    fileInputRef,
    selectedFile,
    setSelectedFile,
    jobId,
    progressData,
    webSocket,
    handleStartImport,
    handleCleanup,
    getButtonText,
    isButtonDisabled
  } = useImportDialog({ onImportCompleted })

  const handleClose = () => {
    handleCleanup()
    onClose()
  }

  const safeGetButtonText = () => {
    try {
      return typeof getButtonText === 'function' ? getButtonText() : 'Iniciar Importação'
    } catch (error) {
      
      return 'Iniciar Importação'
    }
  }

  const safeIsButtonDisabled = () => {
    try {
      return typeof isButtonDisabled === 'function' ? isButtonDisabled() : true
    } catch (error) {
      
      return true
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importar Escolas via CSV</DialogTitle>
      <DialogContent>
        <ConnectionStatus
          isConnected={webSocket.isConnected}
          connectionType={webSocket.connectionType}
          connectionQuality={webSocket.connectionQuality}
          lastMessageTime={webSocket.lastMessageTime}
          error={webSocket.error}
        />

        <FileUpload
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
          isConnected={webSocket.isConnected}
          fileInputRef={fileInputRef}
        />

        <ProgressDisplay
          jobId={jobId}
          progressData={progressData}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
          <Button onClick={handleClose}>Fechar</Button>
          <Button
            variant="contained"
            onClick={jobId ? handleClose : handleStartImport}
            disabled={safeIsButtonDisabled()}
          >
            {safeGetButtonText()}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

ImportDialog.displayName = 'ImportDialog' 