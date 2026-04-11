import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FileCopy
} from '@mui/icons-material'
import { productosService } from 'src/services/inventario/productos.service'

const ProductosView = () => {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productoToDelete, setProductoToDelete] = useState(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrImage, setQrImage] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  
  const router = useRouter()

  useEffect(() => {
    cargarProductos()
  }, [])

  useEffect(() => {
    filtrarProductos()
  }, [searchTerm, productos])

 const cargarProductos = async () => {
  setLoading(true)
  try {
    const data = await productosService.getAll()
    setProductos(data)
    setFilteredProductos(data)
  } catch (error) {
    setSnackbar({ open: true, message: 'Error al cargar productos', severity: 'error' })
  } finally {
    setLoading(false)
  }
}

  const filtrarProductos = () => {
    if (!searchTerm.trim()) {
      setFilteredProductos(productos)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = productos.filter(p => 
        p.nombre?.toLowerCase().includes(term) ||
        p.codigo?.toLowerCase().includes(term) ||
        p.categoria?.toLowerCase().includes(term)
      )
      setFilteredProductos(filtered)
    }
    setPage(0)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productoToDelete) return
    
    try {
      await productosService.delete(productoToDelete.id)
      setSnackbar({ open: true, message: 'Producto eliminado exitosamente', severity: 'success' })
      cargarProductos()
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar producto', severity: 'error' })
    } finally {
      setDeleteDialogOpen(false)
      setProductoToDelete(null)
    }
  }

  const handleGenerarQR = async (producto) => {
    try {
      const data = await productosService.generarQR(producto.id)
      setQrImage(data.qr_code || data.url || data)
      setQrDialogOpen(true)
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al generar QR', severity: 'error' })
    }
  }

  const getStockColor = (stock, stockMinimo) => {
    if (stock <= (stockMinimo || 5)) return 'error'
    if (stock <= (stockMinimo || 5) * 2) return 'warning'
    return 'success'
  }

  const getStockLabel = (stock, stockMinimo) => {
    if (stock <= (stockMinimo || 5)) return 'Bajo Stock'
    if (stock <= (stockMinimo || 5) * 2) return 'Stock Medio'
    return 'Stock Alto'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Productos
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarProductos}
          >
          Actualizar
  </Button>
  <Button
    variant="outlined"
    startIcon={<FileCopy />}
    onClick={() => router.push('/inventario/cargar-excel')}
  >
    Carga Masiva
  </Button>
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => router.push('/inventario/productos/crear')}
  >
    Nuevo Producto
  </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, código o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Productos
              </Typography>
              <Typography variant="h4">{productos.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Bajo Stock
              </Typography>
              <Typography variant="h4" color="error.main">
                {productos.filter(p => p.stock_actual <= (p.stock_minimo || 5)).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Stock Total
              </Typography>
              <Typography variant="h4">
                {productos.reduce((sum, p) => sum + (p.stock_actual || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Valor Total
              </Typography>
              <Typography variant="h4">
                ${productos.reduce((sum, p) => sum + ((p.precio_unitario || 0) * (p.stock_actual || 0)), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((producto) => (
                <TableRow key={producto.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
    {producto.codigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {producto.nombre}
                    </Typography>
                    {producto.descripcion && (
                      <Typography variant="caption" color="text.secondary">
                        {producto.descripcion.substring(0, 50)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={producto.categoria || 'Sin categoría'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    ${(producto.precio_unitario || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                     <Box>
    {/* Stock DISPONIBLE (físico - reservas) */}
    <Chip
      label={`Stock: ${producto.stock_actual || 0}`}
      color={getStockColor(producto.stock_actual, producto.stock_minimo)}
      size="small"
      sx={{ mb: 0.5, fontWeight: 'bold' }}
    />
    
    {/* Mostrar stock físico si es diferente */}
    {producto.stock_fisico !== undefined && producto.stock_fisico !== producto.stock_actual && (
      <Typography variant="caption" display="block" color="text.secondary" fontSize="10px">
        Físico: {producto.stock_fisico}
      </Typography>
    )}
    
    {/* Reservas del usuario actual */}
    {producto.stock_reservado_actual > 0 && (
      <Chip
        label={`🔒 Reservados: ${producto.stock_reservado_actual}`}
        color="warning"
        size="small"
        variant="outlined"
        sx={{ mt: 0.5 }}
      />
    )}
    
    {/* Reservas de otros usuarios */}
    {producto.stock_reservado_otros > 0 && (
      <Typography variant="caption" display="block" color="text.secondary" fontSize="10px">
        ({producto.stock_reservado_otros} reservados por otros)
      </Typography>
    )}
  </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Detalle">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/inventario/productos/${producto.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generar QR">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleGenerarQR(producto)}
                      >
                        <QrCodeIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => router.push(`/inventario/productos/editar/${producto.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(producto)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            
            {filteredProductos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No se encontraron productos
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredProductos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar el producto "{productoToDelete?.nombre}"?
          <br />
          <Typography variant="caption" color="error">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle align="center">Código QR del Producto</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            {qrImage && (
              <>
                <img 
                  src={qrImage} 
                  alt="Código QR" 
                  style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                />
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ mt: 2 }}
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = qrImage
                    link.download = `qr-${productoToDelete?.codigo || 'producto'}.png`
                    link.click()
                  }}
                >
                  Descargar QR
                </Button>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
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

export default ProductosView