import { useDropzone } from 'react-dropzone'
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'

const FileDropzone = ({ onFileSelect, onFileRemove, file, error }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <Box>
      {!file ? (
        <Paper
          {...getRootProps()}
          sx={{
            border: '3px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'primary.50' : 'grey.50',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50'
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            o haz clic para seleccionar
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Formatos aceptados: .xlsx, .xls, .csv (máximo 10MB)
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 2,
            bgcolor: 'success.50',
            border: '2px solid',
            borderColor: 'success.main',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ color: 'success.main' }} />
            <FileIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" fontWeight="medium">
              {file.name}
            </Typography>
            <Chip
              label={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
              size="small"
              variant="outlined"
            />
          </Box>
          <Button
            size="small"
            color="error"
            startIcon={<CloseIcon />}
            onClick={onFileRemove}
          >
            Quitar
          </Button>
        </Paper>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}

export default FileDropzone