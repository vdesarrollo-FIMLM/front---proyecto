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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Paper,
  InputAdornment
} from '@mui/material'
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  QrCodeScanner as ScannerIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import { Html5Qrcode } from 'html5-qrcode'
import { salidasService } from 'src/services/inventario/salidas.service'

const MultipleScannerModal = ({ open, onClose, onProductosAgregados }) => {
  const [scanning, setScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [productosEscaneados, setProductosEscaneados] = useState(new Map())
  const [cantidadInput, setCantidadInput] = useState('')
  const [productoActual, setProductoActual] = useState(null)
  const scannerRef = useRef(null)
  const containerId = 'multiple-scanner-container'

  useEffect(() => {
    if (open) {
      iniciarScanner()
    } else {
      detenerScanner()
      setProductosEscaneados(new Map())
      setProductoActual(null)
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
        onScanSuccess,
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

  const onScanSuccess = async (decodedText) => {
    try {
      const productos = await salidasService.buscarProducto(decodedText)
      
      if (productos.length === 0) {
        setError(`Producto no encontrado: ${decodedText}`)
        setTimeout(() => setError(''), 3000)
        return
      }
      
      const producto = productos[0]
      
      // Verificar si ya fue escaneado
      if (productosEscaneados.has(producto.id)) {
        setError(`${producto.nombre} ya está en la lista`)
        setTimeout(() => setError(''), 3000)
        return
      }
      
      // Mostrar modal de cantidad
      setProductoActual(producto)
      setCantidadInput('1')
      
    } catch (err) {
      setError('Error al buscar producto')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleAgregarCantidad = () => {
    if (!productoActual) return
    
    const cantidad = parseInt(cantidadInput) || 1
    
    if (cantidad > productoActual.stock_actual) {
      setError(`Stock insuficiente. Disponible: ${productoActual.stock_actual}`)
      setTimeout(() => setError(''), 3000)
      return
    }
    
    setProductosEscaneados(prev => {
      const newMap = new Map(prev)
      newMap.set(productoActual.id, {
        ...productoActual,
        cantidad_retirar: cantidad
      })
      return newMap
    })
    
    setSuccess(`${productoActual.nombre} agregado (${cantidad} unidades)`)
    setTimeout(() => setSuccess(''), 2000)
    setProductoActual(null)
    setCantidadInput('')
  }

  const handleEliminarProducto = (productoId) => {
    setProductosEscaneados(prev => {
      const newMap = new Map(prev)
      newMap.delete(productoId)
      return newMap
    })
  }

  const handleManualSubmit = async () => {
    if (!manualCode.trim()) return
    
    try {
      const productos = await salidasService.buscarProducto(manualCode)
      
      if (productos.length === 0) {
        setError(`Producto no encontrado: ${manualCode}`)
        setTimeout(() => setError(''), 3000)
        return
      }
      
      const producto = productos[0]
      
      if (productosEscaneados.has(producto.id)) {
        setError(`${producto.nombre} ya está en la lista`)
        setTimeout(() => setError(''), 3000)
        return
      }
      
      setProductoActual(producto)
      setCantidadInput('1')
      setManualCode('')
      
    } catch (err) {
      setError('Error al buscar producto')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleFinalizar = () => {
    if (productosEscaneados.size === 0) {
      setError('No hay productos escaneados')
      return
    }
    
    const productosLista = Array.from(productosEscaneados.values())
    onProductosAgregados(productosLista)
    onClose()
  }

  const totalUnidades = Array.from(productosEscaneados.values())
    .reduce((sum, p) => sum + p.cantidad_retirar, 0)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScannerIcon /> Escanear Múltiples Productos
          </Box>
          <Chip 
            label={`${productosEscaneados.size} productos`} 
            color="primary" 
            size="small"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Información de stock */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Modo de escaneo múltiple:</strong> Escanea cada producto, ingresa la cantidad y agrégalo a la lista.
        </Alert>
        
        {/* Scanner */}
        <Paper
          id={containerId}
          sx={{
            width: '100%',
            minHeight: 250,
            backgroundColor: '#000',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 2
          }}
        />
        
        {/* Mensajes */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        
        {/* Modal de cantidad */}
        {productoActual && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {productoActual.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Código: {productoActual.codigo} | Stock disponible: {productoActual.stock_actual}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                type="number"
                label="Cantidad a retirar"
                value={cantidadInput}
                onChange={(e) => setCantidadInput(e.target.value)}
                size="small"
                sx={{ width: 150 }}
                inputProps={{ min: 1, max: productoActual.stock_actual }}
                autoFocus
              />
              <Button variant="contained" onClick={handleAgregarCantidad}>
                Agregar
              </Button>
              <Button variant="outlined" onClick={() => setProductoActual(null)}>
                Cancelar
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Lista de productos escaneados */}
        {productosEscaneados.size > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Productos Escaneados ({productosEscaneados.size} productos, {totalUnidades} unidades)
            </Typography>
            <List sx={{ maxHeight: 250, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              {Array.from(productosEscaneados.values()).map((producto) => (
                <ListItem
                  key={producto.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleEliminarProducto(producto.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  divider
                >
                  <ListItemText
                    primary={producto.nombre}
                    secondary={`${producto.codigo} • ${producto.cantidad_retirar} unidades`}
                  />
                  <Chip 
                    label={`${producto.cantidad_retirar}`} 
                    size="small" 
                    color="warning"
                    sx={{ mr: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Entrada manual */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            o ingresa código manualmente:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ej: PROD-001"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <Button variant="outlined" onClick={handleManualSubmit}>
              Agregar
            </Button>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleFinalizar}
          disabled={productosEscaneados.size === 0}
          startIcon={<CheckCircleIcon />}
        >
          Terminar ({productosEscaneados.size})
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MultipleScannerModal