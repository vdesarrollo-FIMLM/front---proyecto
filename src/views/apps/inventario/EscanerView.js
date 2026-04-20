import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Divider
} from '@mui/material'
import {
  Search as SearchIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  QrCodeScanner as ScannerIcon,
  Info as InfoIcon,
  QrCode as QrCodeIcon,
  Scanner as BarcodeIcon,
  Keyboard as KeyboardIcon
} from '@mui/icons-material'
import QRScanner from './components/QRScanner'
import ProductoResultCard from './components/ProductoResultCard'
import { productosService } from 'src/services/inventario/productos.service'
import { movimientosService } from 'src/services/inventario/movimientos.service'

const EscanerView = () => {
  const router = useRouter()
  const [tipoOperacion, setTipoOperacion] = useState('consulta')
  const [scannerActive, setScannerActive] = useState(true)
  const [productoEncontrado, setProductoEncontrado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const operaciones = [
    { id: 'consulta', label: 'Consultar', icon: SearchIcon, color: 'primary' },
    { id: 'entrada', label: 'Entrada', icon: ArrowDownIcon, color: 'success' },
    { id: 'salida', label: 'Salida', icon: ArrowUpIcon, color: 'warning' }
  ]

  const handleScan = async (codigo) => {
    if (!codigo) return
    
    setLoading(true)
    try {
      const productos = await productosService.searchByCodigo(codigo)
      
      if (!productos || productos.length === 0) {
        // Producto no encontrado
        const crearProducto = window.confirm(
          `El código "${codigo}" no existe en el sistema.\n\n¿Deseas crear un nuevo producto con este código?`
        )
        if (crearProducto) {
          router.push(`/inventario/productos/crear?codigo=${encodeURIComponent(codigo)}`)
        }
        return
      }
      
      // Tomar el primer producto (el más relevante)
      const producto = productos.length === 1 ? productos[0] : productos[0]
      setProductoEncontrado(producto)
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al buscar producto', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmar = async (cantidad) => {
    if (!productoEncontrado) return
    
    setLoading(true)
    try {
      if (tipoOperacion === 'entrada') {
        await movimientosService.createEntrada({
          producto_id: productoEncontrado.id,
          cantidad: cantidad,
          motivo: 'Escaneo rápido',
          notas: `Entrada registrada desde escáner`,
          usuario: 'admin'
        })
        setSnackbar({ open: true, message: `✅ Entrada registrada: +${cantidad} unidades`, severity: 'success' })
      } else if (tipoOperacion === 'salida') {
        if (cantidad > productoEncontrado.stock_actual) {
          setSnackbar({ open: true, message: `Stock insuficiente. Disponible: ${productoEncontrado.stock_actual}`, severity: 'error' })
          setLoading(false)
          return
        }
        await movimientosService.createSalida({
          producto_id: productoEncontrado.id,
          cantidad: cantidad,
          motivo: 'Escaneo rápido',
          notas: `Salida registrada desde escáner`,
          cliente_destino: 'Cliente escaneo',
          usuario: 'admin'
        })
        setSnackbar({ open: true, message: `✅ Salida registrada: -${cantidad} unidades`, severity: 'success' })
      }
      
      // Limpiar producto y continuar escaneando
      setProductoEncontrado(null)
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al registrar movimiento', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = () => {
    setProductoEncontrado(null)
  }

  const handleNuevoEscaneo = () => {
    setProductoEncontrado(null)
    setScannerActive(true)
  }

  const handleError = (error) => {
    setSnackbar({ open: true, message: 'Error con la cámara. Verifica los permisos.', severity: 'error' })
  }

  const tipoActual = operaciones.find(o => o.id === tipoOperacion)
  const IconActual = tipoActual?.icon

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <ScannerIcon sx={{ fontSize: 40 }} />
          Escáner de Códigos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Usa la cámara de tu celular para escanear códigos QR y de barras
        </Typography>
      </Box>

      {/* Selector de Operación */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom align="center">
          Selecciona el tipo de operación:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
          {operaciones.map((op) => {
            const Icon = op.icon
            const isActive = tipoOperacion === op.id
            return (
              <Button
                key={op.id}
                variant={isActive ? 'contained' : 'outlined'}
                color={op.color}
                startIcon={<Icon />}
                onClick={() => {
                  setTipoOperacion(op.id)
                  setProductoEncontrado(null)
                }}
                sx={{ minWidth: 120 }}
              >
                {op.label}
              </Button>
            )
          })}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Chip
            icon={<IconActual />}
            label={`Operación actual: ${tipoActual?.label || 'Consulta'}`}
            color={tipoActual?.color}
            sx={{ px: 1 }}
          />
        </Box>
      </Paper>

      {/* Scanner Container */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScannerIcon /> Área de Escaneo
        </Typography>
        
        {scannerActive && !productoEncontrado ? (
          <QRScanner
            onScan={handleScan}
            onError={handleError}
            onClose={() => setScannerActive(false)}
            tipoOperacion={tipoOperacion}
          />
        ) : productoEncontrado ? (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Producto detectado:</strong> Código {productoEncontrado.codigo}
            </Alert>
            <ProductoResultCard
              producto={productoEncontrado}
              tipoOperacion={tipoOperacion}
              onConfirmar={handleConfirmar}
              onCancelar={handleCancelar}
            />
            <Button
              variant="outlined"
              onClick={handleNuevoEscaneo}
              sx={{ mt: 2 }}
              startIcon={<ScannerIcon />}
            >
              Escanear otro producto
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              El escáner está detenido. Haz clic en "Detener Escaneo" para reiniciar.
            </Typography>
          </Box>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={30} />
          </Box>
        )}
      </Paper>

      {/* Ayuda */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon /> ¿Cómo escanear?
            </Typography>
            <Grid container spacing={2}>
              {[
                { num: 1, title: 'Permitir Cámara', desc: 'Acepta el permiso de cámara cuando el navegador lo solicite.' },
                { num: 2, title: 'Enfocar el Código', desc: 'Apunta la cámara al código QR o de barras del producto.' },
                { num: 3, title: 'Esperar Detección', desc: 'Mantén el código estable hasta que se detecte automáticamente.' },
                { num: 4, title: 'Confirmar Operación', desc: 'Revisa la información y confirma la operación.' }
              ].map((step) => (
                <Grid item xs={12} sm={6} md={3} key={step.num}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      {step.num}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Tipos de Códigos Soportados */}
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
        Tipos de Códigos Soportados
      </Typography>
      <Grid container spacing={2}>
        {[
          { icon: QrCodeIcon, title: 'Códigos QR', desc: 'Generados por el sistema o personalizados', color: '#1e40af', bg: '#dbeafe' },
          { icon: BarcodeIcon, title: 'EAN-13 / UPC', desc: 'Códigos de barras estándar de 12-13 dígitos', color: '#d97706', bg: '#fef3c7' },
          { icon: QrCodeIcon, title: 'Códigos Internos', desc: 'Formato: PROD-YYYYMMDD-XXXXXX', color: '#059669', bg: '#d1fae5' },
          { icon: KeyboardIcon, title: 'Ingreso Manual', desc: 'También puedes ingresar códigos manualmente', color: '#4b5563', bg: '#e5e7eb' }
        ].map((type, idx) => {
          const Icon = type.icon
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: type.bg,
                      color: type.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}
                  >
                    <Icon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {type.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EscanerView