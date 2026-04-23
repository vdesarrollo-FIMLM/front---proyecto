// src/views/apps/inventario/components/GestionUbicaciones.js
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  SwapHoriz as TransferIcon
} from '@mui/icons-material'
import { productosService } from 'src/services/inventario/productos.service'

const GestionUbicaciones = ({ open, onClose, producto, onActualizar }) => {
  const [loading, setLoading] = useState(false)
  const [ubicaciones, setUbicaciones] = useState(producto?.stock_por_ubicacion || [])
  const [nuevaUbicacion, setNuevaUbicacion] = useState('')
  const [nuevaCantidad, setNuevaCantidad] = useState(0)
  const [editando, setEditando] = useState(null)
  const [transferir, setTransferir] = useState({ open: false, origen: '', destino: '', cantidad: '' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [agregarStock, setAgregarStock] = useState({ open: false, ubicacion: '', cantidad: '' })

useEffect(() => {
  if (open && producto?.producto?.codigo) {
    cargarUbicaciones()
  }
}, [open, producto?.producto?.codigo])

const cargarUbicaciones = async () => {
  setLoading(true)
  try {
    const data = await productosService.getProductoConUbicaciones(producto.producto.codigo)
    setUbicaciones(data.stock_por_ubicacion || [])
  } catch (error) {
    console.error('Error cargando ubicaciones:', error)
  } finally {
    setLoading(false)
  }
}
  const handleAgregarUbicacion = async () => {
  if (!nuevaUbicacion.trim()) {
    setSnackbar({ open: true, message: 'Ingresa un nombre de ubicación', severity: 'error' })
    return
  }

  // Verificar si la ubicación ya existe
  const ubicacionExistente = ubicaciones.find(u => u.ubicacion === nuevaUbicacion.toUpperCase())
  if (ubicacionExistente) {
    setSnackbar({ open: true, message: `La ubicación ${nuevaUbicacion.toUpperCase()} ya existe. Usa "+ Stock" para agregar más unidades.`, severity: 'warning' })
    return
  }

  setLoading(true)
  try {
    await productosService.crearUbicacion(producto.producto.codigo, nuevaUbicacion.toUpperCase(), nuevaCantidad)
    setSnackbar({ open: true, message: 'Ubicación agregada', severity: 'success' })
    setNuevaUbicacion('')
    setNuevaCantidad(0)
    await cargarUbicaciones()  // ← En lugar de onActualizar()
    await onActualizar()       // ← También actualiza la página principal
  } catch (error) {
    setSnackbar({ open: true, message: error.response?.data?.detail || 'Error al agregar', severity: 'error' })
  } finally {
    setLoading(false)
  }
}
  const handleAgregarStockUbicacion = async () => {
  if (!agregarStock.cantidad || agregarStock.cantidad <= 0) {
    setSnackbar({ open: true, message: 'Ingresa una cantidad válida', severity: 'error' })
    return
  }

  setLoading(true)
  try {
    const ubicacionActual = ubicaciones.find(u => u.ubicacion === agregarStock.ubicacion)
    const nuevaCantidad = (ubicacionActual?.stock_fisico || 0) + parseInt(agregarStock.cantidad)
    
    await productosService.actualizarUbicacion(producto.producto.codigo, agregarStock.ubicacion, nuevaCantidad)
    setSnackbar({ open: true, message: `Se agregaron ${agregarStock.cantidad} unidades a ${agregarStock.ubicacion}`, severity: 'success' })
    setAgregarStock({ open: false, ubicacion: '', cantidad: '' })
    await onActualizar()
    const data = await productosService.getProductoConUbicaciones(producto.producto.codigo)
    setUbicaciones(data.stock_por_ubicacion || [])
  } catch (error) {
    setSnackbar({ open: true, message: error.response?.data?.detail || 'Error al agregar stock', severity: 'error' })
  } finally {
    setLoading(false)
  }
}
  const handleActualizarCantidad = async (ubicacion, nuevaCantidad) => {
    if (nuevaCantidad < 0) {
      setSnackbar({ open: true, message: 'La cantidad no puede ser negativa', severity: 'error' })
      return
    }

    setLoading(true)
    try {
      await productosService.actualizarUbicacion(producto.producto.codigo, ubicacion, nuevaCantidad)
      setSnackbar({ open: true, message: 'Cantidad actualizada', severity: 'success' })
      setEditando(null)
      await onActualizar()
      const data = await productosService.getProductoConUbicaciones(producto.producto.codigo)
      setUbicaciones(data.stock_por_ubicacion || [])
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.detail || 'Error al actualizar', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarUbicacion = async (ubicacion) => {
  const ubicacionActual = ubicaciones.find(u => u.ubicacion === ubicacion)
  if (ubicacionActual && ubicacionActual.stock_fisico > 0) {
    setSnackbar({ open: true, message: `No se puede eliminar ${ubicacion} porque tiene ${ubicacionActual.stock_fisico} unidades. Transfiere o retira el stock primero.`, severity: 'warning' })
    return
  }

  if (!window.confirm(`¿Eliminar la ubicación ${ubicacion}?`)) return

  setLoading(true)
  try {
    await productosService.eliminarUbicacion(producto.producto.codigo, ubicacion)
    setSnackbar({ open: true, message: 'Ubicación eliminada', severity: 'success' })
    await onActualizar()
    const data = await productosService.getProductoConUbicaciones(producto.producto.codigo)
    setUbicaciones(data.stock_por_ubicacion || [])
  } catch (error) {
    setSnackbar({ open: true, message: error.response?.data?.detail || 'Error al eliminar', severity: 'error' })
  } finally {
    setLoading(false)
  }
}

  const handleTransferir = async () => {
  if (!transferir.origen || !transferir.destino || !transferir.cantidad || transferir.cantidad <= 0) {
    setSnackbar({ open: true, message: 'Complete todos los campos', severity: 'error' })
    return
  }

  if (transferir.origen === transferir.destino) {
    setSnackbar({ open: true, message: 'Origen y destino no pueden ser iguales', severity: 'error' })
    return
  }

  const ubicacionOrigen = ubicaciones.find(u => u.ubicacion === transferir.origen)
  if (!ubicacionOrigen || ubicacionOrigen.stock_disponible < parseInt(transferir.cantidad)) {
    setSnackbar({ open: true, message: `Stock insuficiente en ${transferir.origen}. Disponible: ${ubicacionOrigen?.stock_disponible || 0}`, severity: 'error' })
    return
  }

  setLoading(true)
  try {
    await productosService.transferirStock(
      producto.producto.codigo,
      transferir.origen,
      transferir.destino,
      parseInt(transferir.cantidad)
    )
    setSnackbar({ open: true, message: `Transferidas ${transferir.cantidad} unidades de ${transferir.origen} a ${transferir.destino}`, severity: 'success' })
    setTransferir({ open: false, origen: '', destino: '', cantidad: '' })
    await onActualizar()
    const data = await productosService.getProductoConUbicaciones(producto.producto.codigo)
    setUbicaciones(data.stock_por_ubicacion || [])
  } catch (error) {
    setSnackbar({ open: true, message: error.response?.data?.detail || 'Error al transferir', severity: 'error' })
  } finally {
    setLoading(false)
  }
}

  const totalStock = ubicaciones.reduce((sum, u) => sum + (u.stock_fisico || 0), 0)

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              📦 Gestionar Ubicaciones - {producto?.producto?.nombre}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Resumen de stock */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">
              Stock total: <strong>{totalStock}</strong> unidades
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stock mínimo recomendado: {producto?.producto?.stock_minimo || 5}
            </Typography>
          </Paper>

          {/* Tabla de ubicaciones */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell>Ubicación</TableCell>
                  <TableCell align="right">Stock Físico</TableCell>
                  <TableCell align="right">Reservado</TableCell>
                  <TableCell align="right">Disponible</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ubicaciones.map((u) => (
                  <TableRow key={u.ubicacion}>
                    <TableCell>
                      <Typography fontWeight="medium">{u.ubicacion}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {editando === u.ubicacion ? (
                        <TextField
                          type="number"
                          size="small"
                          value={u.stock_fisico}
                          onChange={(e) => {
                            const nuevos = ubicaciones.map(ub => 
                              ub.ubicacion === u.ubicacion 
                                ? { ...ub, stock_fisico: parseInt(e.target.value) || 0 }
                                : ub
                            )
                            setUbicaciones(nuevos)
                          }}
                          sx={{ width: 80 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        u.stock_fisico
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={u.stock_reservado || 0} 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={u.stock_disponible || 0} 
                        size="small" 
                        color={u.stock_disponible <= (producto?.producto?.stock_minimo || 5) ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell align="center">
  {editando === u.ubicacion ? (
    <>
      <IconButton size="small" color="success" onClick={() => handleActualizarCantidad(u.ubicacion, u.stock_fisico)}>
        ✓
      </IconButton>
      <IconButton size="small" color="error" onClick={() => setEditando(null)}>
        ✗
      </IconButton>
    </>
  ) : (
    <>
      {/* Botón AGREGAR STOCK - NUEVO */}
      <IconButton 
        size="small" 
        color="primary" 
        onClick={() => setAgregarStock({ open: true, ubicacion: u.ubicacion, cantidad: '' })}
        title="Agregar stock a esta ubicación"
      >
        <AddIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => setEditando(u.ubicacion)}>
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" color="error" onClick={() => handleEliminarUbicacion(u.ubicacion)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  )}
</TableCell>
                  </TableRow>
                ))}
                {ubicaciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">No hay ubicaciones registradas</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Agregar nueva ubicación */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>➕ Agregar nueva ubicación</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                label="Ubicación"
                value={nuevaUbicacion}
                onChange={(e) => setNuevaUbicacion(e.target.value)}
                placeholder="Ej: D12-2"
                sx={{ width: 150 }}
              />
              <TextField
                size="small"
                type="number"
                label="Cantidad inicial"
                value={nuevaCantidad}
                onChange={(e) => setNuevaCantidad(parseInt(e.target.value) || 0)}
                sx={{ width: 120 }}
                inputProps={{ min: 0 }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAgregarUbicacion}
                disabled={loading}
              >
                Agregar
              </Button>
            </Box>
          </Paper>

          {/* Transferir stock */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<TransferIcon />}
            onClick={() => setTransferir({ ...transferir, open: true })}
            disabled={ubicaciones.length < 2}
          >
            Transferir stock entre ubicaciones
          </Button>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de transferencia */}
      <Dialog open={transferir.open} onClose={() => setTransferir({ ...transferir, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Transferir stock entre ubicaciones</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Ubicación origen"
              value={transferir.origen}
              onChange={(e) => setTransferir({ ...transferir, origen: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Seleccionar</option>
              {ubicaciones.map(u => (
                <option key={u.ubicacion} value={u.ubicacion}>
                  {u.ubicacion} (disponible: {u.stock_disponible})
                </option>
              ))}
            </TextField>
            
            <TextField
              select
              label="Ubicación destino"
              value={transferir.destino}
              onChange={(e) => setTransferir({ ...transferir, destino: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Seleccionar</option>
              {ubicaciones.map(u => (
                <option key={u.ubicacion} value={u.ubicacion}>
                  {u.ubicacion}
                </option>
              ))}
            </TextField>
            
            <TextField
              type="number"
              label="Cantidad a transferir"
              value={transferir.cantidad}
              onChange={(e) => setTransferir({ ...transferir, cantidad: e.target.value })}
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferir({ open: false, origen: '', destino: '', cantidad: '' })}>Cancelar</Button>
          <Button variant="contained" onClick={handleTransferir} disabled={loading}>
            Transferir
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal para agregar stock a ubicación existente */}
<Dialog open={agregarStock.open} onClose={() => setAgregarStock({ ...agregarStock, open: false })} maxWidth="xs" fullWidth>
  <DialogTitle>
    Agregar stock a {agregarStock.ubicacion}
  </DialogTitle>
  <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Stock actual: {ubicaciones.find(u => u.ubicacion === agregarStock.ubicacion)?.stock_fisico || 0} unidades
      </Typography>
      <TextField
        type="number"
        label="Cantidad a agregar"
        value={agregarStock.cantidad}
        onChange={(e) => setAgregarStock({ ...agregarStock, cantidad: e.target.value })}
        inputProps={{ min: 1 }}
        fullWidth
        autoFocus
      />
      <Typography variant="caption" color="text.secondary">
        Nota: Esta cantidad se sumará al stock existente y al stock total del producto.
      </Typography>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAgregarStock({ open: false, ubicacion: '', cantidad: '' })}>Cancelar</Button>
    <Button variant="contained" color="primary" onClick={handleAgregarStockUbicacion} disabled={loading}>
      Agregar Stock
    </Button>
  </DialogActions>
</Dialog>
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

      {loading && <CircularProgress size={24} sx={{ position: 'absolute', bottom: 20, right: 20 }} />}
    </>
  )
}

export default GestionUbicaciones