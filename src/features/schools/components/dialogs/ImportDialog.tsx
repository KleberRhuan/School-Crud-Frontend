import React, { useRef, useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, LinearProgress, Stack, Typography } from '@mui/material'
import { useCsvImport } from '../../hooks/useCsvJobs'
import { useCsvWebSocket } from '../../hooks/useCsvWebSocket'
import { useAuthStore } from '@/stores/authStore'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
}

interface CsvProgressData {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  progress?: number
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [progressData, setProgressData] = useState<CsvProgressData | null>(null)

  const accessToken = useAuthStore(state => state.accessToken)
  const csvImport = useCsvImport()
  
  const { isConnected, subscribe, unsubscribe } = useCsvWebSocket({
    accessToken: accessToken || '',
    onProgressUpdate: (data) => {
      setProgressData(data)
    },
    _onError: (error) => {
      void error
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleStartImport = () => {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)
    csvImport.mutate(formData, {
      onSuccess: (response) => {
        setJobId(response.jobId)
        if (isConnected) {
          subscribe(response.jobId)
        }
      },
    })
  }

  const handleClose = () => {
    if (jobId) {
      unsubscribe(jobId)
    }
    setJobId(null)
    setProgressData(null)
    onClose()
  }

  const progress = progressData?.progress || 0
  const isCompleted = progressData?.status === 'COMPLETED'
  const isUploading = csvImport.status === 'pending'

  const getButtonText = () => {
    if (jobId) {
      return isCompleted ? 'Concluído' : 'Importando...'
    }
    return 'Iniciar Importação'
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importar Escolas via CSV</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Faça upload de um arquivo CSV para importar dados de escolas
        </Typography>

        <Box sx={{ p: 2, textAlign: 'center' }}>
          <input
            type="file"
            accept=".csv"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => fileInputRef.current?.click()}>
            {selectedFile ? selectedFile.name : 'Selecionar arquivo CSV'}
          </Button>
        </Box>

        {jobId && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Progresso da importação: {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
          <Button onClick={handleClose}>Fechar</Button>
          <Button
            variant="contained"
            onClick={jobId ? handleClose : handleStartImport}
            disabled={!selectedFile || isUploading || (!!jobId && !isCompleted)}
          >
            {getButtonText()}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

ImportDialog.displayName = 'ImportDialog' 