import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface FileUploadProps {
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  isConnected: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export const FileUpload: React.FC<FileUploadProps> = ({
  selectedFile,
  onFileChange,
  isConnected,
  fileInputRef
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    onFileChange(file || null)
  }

  return (
    <>
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
        <Button 
          variant="outlined" 
          startIcon={<CloudUploadIcon />} 
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected}
        >
          {selectedFile ? selectedFile.name : 'Selecionar arquivo CSV'}
        </Button>
        
        {!isConnected && (
          <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 1 }}>
            Aguardando conexão WebSocket...
          </Typography>
        )}
      </Box>
    </>
  )
} 