import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Button,
  Typography,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material'
import {
  Stop as StopIcon,
  Cameraswitch as SwitchCameraIcon,
  Keyboard as KeyboardIcon,
  QrCodeScanner as ScannerIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { Html5Qrcode } from 'html5-qrcode'

const QRScanner = ({ onScan, onError, onClose, tipoOperacion }) => {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [cameras, setCameras] = useState([])
  const [currentCamera, setCurrentCamera] = useState(null)
  const scannerRef = useRef(null)
  const containerId = 'qr-scanner-reader'

  useEffect(() => {
    iniciarScanner()
    cargarCamaras()

    return () => {
      detenerScanner()
    }
  }, [])

  const cargarCamaras = async () => {
    try {
      const camerasList = await Html5Qrcode.getCameras()
      setCameras(camerasList)
      if (camerasList.length > 0) {
        setCurrentCamera(camerasList[0].id)
      }
    } catch (err) {
      console.error('Error cargando cámaras:', err)
    }
  }

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
        },
        (errorMessage) => {
          // Ignorar errores de escaneo continuo
          if (errorMessage.includes('No QR code found')) return
          console.log('Escaneando:', errorMessage)
        }
      )
      setScanning(true)
    } catch (err) {
      setError('Error al acceder a la cámara. Verifica los permisos.')
      if (onError) onError(err)
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

  const cambiarCamara = async () => {
    if (!scannerRef.current || !scanning) return
    
    const currentIndex = cameras.findIndex(c => c.id === currentCamera)
    const nextIndex = (currentIndex + 1) % cameras.length
    const nextCamera = cameras[nextIndex]
    
    if (nextCamera) {
      await detenerScanner()
      setCurrentCamera(nextCamera.id)
      
      try {
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        }
        await scannerRef.current.start(
          { deviceId: { exact: nextCamera.id } },
          config,
          onScan,
          () => {}
        )
        setScanning(true)
      } catch (err) {
        setError('Error cambiando cámara')
      }
    }
  }

  const handleManualInput = () => {
    const codigo = prompt('Ingresa el código manualmente:')
    if (codigo && codigo.trim()) {
      onScan(codigo.trim())
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Scanner Container */}
      <Paper
        id={containerId}
        sx={{
          width: '100%',
          minHeight: 400,
          backgroundColor: '#000',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      />
      
      {/* Scanner Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: 250,
            height: 250,
            border: '2px dashed rgba(255,255,255,0.5)',
            borderRadius: 2,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)',
              animation: 'scan 2s ease-in-out infinite'
            }
          }}
        />
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            bottom: 20,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.6)',
            px: 2,
            py: 1,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ScannerIcon fontSize="small" />
          Enfoca el código dentro del área
        </Typography>
      </Box>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Scanner Controls */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<StopIcon />}
          onClick={onClose}
        >
          Detener Escaneo
        </Button>
        {cameras.length > 1 && (
          <Button
            variant="outlined"
            startIcon={<SwitchCameraIcon />}
            onClick={cambiarCamara}
          >
            Cambiar Cámara
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<KeyboardIcon />}
          onClick={handleManualInput}
        >
          Ingresar Manual
        </Button>
      </Box>
      
      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
        `}
      </style>
    </Box>
  )
}

export default QRScanner