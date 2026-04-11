import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  QrCode as QrCodeIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Download as DownloadIcon
} from '@mui/icons-material'
import { productosService } from 'src/services/inventario/productos.service'
import { movimientosService } from 'src/services/inventario/movimientos.service'

const DetalleProductoView = () => {
  const router = useRouter()
  const { id } = router.query
  const [producto, setProducto] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrImage, setQrImage] = useState('')
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    if (id) {
      cargarDatos()
    }
  }, [id])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [productoData, movimientosData] = await Promise.all([
        productosService.getById(id),
        movimientosService.getAll({ producto_id: id })
      ])
      setProducto(productoData)
      setMovimientos(movimientosData)
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al cargar datos', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerarQR = async () => {
    try {
      const data = await productosService.generarQR(id)
      setQrImage(data.qr_code || data.url || data)
      setQrDialogOpen(true)
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al generar QR', severity: 'error' })
    }
  }

  const getStockColor = () => {
    if (producto.stock_actual <= producto.stock_minimo) return 'error'
    if (producto.stock_actual <= producto.stock_minimo * 2) return 'warning'
    return 'success'
  }

  const getStockStatus = () => {
    if (producto.stock_actual <= producto.stock_minimo) return '¡Bajo Stock!'
    if (producto.stock_actual <= producto.stock_minimo * 2) return 'Stock Moderado'
    return 'Stock Suficiente'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!producto) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Producto no encontrado</Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push('/inventario/productos')}>
          Volver a Productos
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/inventario/productos')}
          >
            Volver
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {producto.nombre}
          </Typography>
          <Chip 
            label={`${producto.stock_actual} unidades`} 
            color={getStockColor()}
            size="medium"
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar Producto">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/inventario/productos/editar/${producto.id}`)}
            >
              Editar
            </Button>
          </Tooltip>
          <Tooltip title="Generar QR">
            <Button
              variant="outlined"
              startIcon={<QrCodeIcon />}
              onClick={handleGenerarQR}
            >
              QR
            </Button>
          </Tooltip>
          <Tooltip title="Registrar Entrada">
            <Button
              variant="contained"
              color="success"
              startIcon={<ArrowDownIcon />}
              onClick={() => router.push(`/inventario/entrada?producto=${producto.id}`)}
            >
              Entrada
            </Button>
          </Tooltip>
          <Tooltip title="Registrar Salida">
            <Button
              variant="contained"
              color="warning"
              startIcon={<ArrowUpIcon />}
              onClick={() => router.push(`/inventario/salida?producto=${producto.id}`)}
            >
              Salida
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Información del Producto */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Información General</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Código
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                {producto.codigo}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Categoría
              </Typography>
              <Chip label={producto.categoria || 'Sin categoría'} size="small" sx={{ mb: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ubicación
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationIcon fontSize="small" /> {producto.ubicacion || 'No especificada'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Precios</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Precio Unitario
              </Typography>
              <Typography variant="h5" color="primary.main" gutterBottom>
                ${(producto.precio_unitario || 0).toFixed(2)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Valor Total en Stock
              </Typography>
              <Typography variant="h6">
                ${((producto.precio_unitario || 0) * (producto.stock_actual || 0)).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Stock</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Estado
              </Typography>
              <Chip 
                label={getStockStatus()} 
                color={getStockColor()}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Stock Actual / Mínimo
              </Typography>
              <Typography variant="h4">
                {producto.stock_actual}
                <Typography component="span" variant="body2" color="text.secondary">
                  / {producto.stock_minimo}
                </Typography>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Descripción */}
      {producto.descripcion && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Descripción</Typography>
          <Typography variant="body1" color="text.secondary">
            {producto.descripcion}
          </Typography>
        </Paper>
      )}

      {/* Historial de Movimientos */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowDownIcon /> <ArrowUpIcon /> Historial de Movimientos
        </Typography>
        
        {movimientos.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Cliente/Proveedor</TableCell>
                  <TableCell>Usuario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimientos.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>
                      {new Date(mov.fecha_movimiento).toLocaleString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                        color={mov.tipo === 'entrada' ? 'success' : 'warning'}
                        size="small"
                        icon={mov.tipo === 'entrada' ? <ArrowDownIcon /> : <ArrowUpIcon />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        {mov.cantidad}
                      </Typography>
                    </TableCell>
                    <TableCell>{mov.motivo || '-'}</TableCell>
                    <TableCell>{mov.cliente_destino || '-'}</TableCell>
                    <TableCell>{mov.usuario || 'admin'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No hay movimientos registrados para este producto
            </Typography>
          </Box>
        )}
      </Paper>

      {/* QR Dialog */}
      {/* ... (similar al de productos) */}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default DetalleProductoView