import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material'
import { Html5Qrcode } from 'html5-qrcode'

const QRScannerModal = ({ open, onClose, onScan }) => {
  const [scanning, setScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState('')
  const scannerRef = useRef(null)
  const containerId = 'qr-scanner-container'

  useEffect(() => {
    if (open) {
      iniciarScanner()
    } else {
      detenerScanner()
    }

    return () => {
      detenerScanner()
    }
  }, [open])

  const iniciarScanner = async () => {
    try {
      setError('')
      scannerRef.current = new Html5Qrcode(containerId)
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText)
          onClose()
        },
        (errorMessage) => {
          // Ignorar errores de escaneo continuo
        }
      )
      setScanning(true)
    } catch (err) {
      setError('Error al acceder a la cámara. Verifica los permisos.')
      console.error(err)
    }
  }

  const detenerScanner = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
        setScanning(false)
      } catch (err) {
        console.error('Error deteniendo scanner:', err)
      }
    }
  }

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim())
      setManualCode('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📷 Escanear Código
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box
          id={containerId}
          sx={{
            width: '100%',
            minHeight: 300,
            backgroundColor: '#000',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 2
          }}
        />
        
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mb: 2 }}>
          Enfoca el código QR o de barras del producto
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            o ingresa el código manualmente:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ej: PROD-20240115-ABC123"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <Button variant="contained" onClick={handleManualSubmit}>
              Usar
            </Button>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default QRScannerModal