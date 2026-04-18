import { useState, useEffect, useRef } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Camera as CameraIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import { entradasService } from 'src/services/inventario/entradas.service'
import QRScannerModal from './components/QRScannerModal'
import { useAuth } from 'src/hooks/useAuth'

const EntradaView = () => {
  const { user, hasPermission } = useAuth()
  const isSuperAdmin = user?.rol === 'super_admin'
  // Estado principal
  const [productosSeleccionados, setProductosSeleccionados] = useState([])
  const [entradasPendientes, setEntradasPendientes] = useState([])
  const [ultimasEntradas, setUltimasEntradas] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [detalleModalOpen, setDetalleModalOpen] = useState(false)
  const [detalleEntrada, setDetalleEntrada] = useState(null)
  
  // Formulario
  const [formData, setFormData] = useState({
    motivo: 'Compra',
    origen_nombre: '',
    ubicacion: '',
    notas: '',
    fecha: new Date().toISOString().slice(0, 16)
  })

  const motivos = ['Compra', 'Donación', 'Devolución', 'Traslado', 'Ajuste de Inventario', 'Otro']

  // Cargar historial al iniciar
  useEffect(() => {
    cargarUltimasEntradas()
  }, [])

  const cargarUltimasEntradas = async () => {
    try {
      const entradas = await entradasService.getUltimasEntradas(10)
      setUltimasEntradas(entradas)
    } catch (error) {
      console.error('Error cargando historial:', error)
    }
  }

  // Búsqueda de productos
  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    try {
    const results = await entradasService.buscarProducto(searchTerm)
    console.log('🔍 Resultados de búsqueda:', results)
    results.forEach(p => {
      console.log(`  - ${p.nombre}: código=${p.codigo}, id=${p.id}`)
    })
    setSearchResults(results)
    setShowSearchResults(true)
  } catch (error) {
    setSnackbar({ open: true, message: 'Error al buscar producto', severity: 'error' })
  }
}

  const handleSelectProduct = (producto) => {
  console.log('🟢 Producto seleccionado:', producto)
  console.log('  - Código del producto:', producto.codigo)  
  console.log('  - ObjectId:', producto.id)  // Esto es el _id de MongoDB
  
 
  const codigoProducto = producto.codigo
  
  // ✅ Ubicación OPCIONAL - puede ser vacío
  const ubicacion = formData.ubicacion || null
  
  const existente = productosSeleccionados.find(p => p.producto_id === codigoProducto && p.ubicacion === ubicacion)
  
  if (existente) {
    setProductosSeleccionados(prev =>
      prev.map(p =>
        p.producto_id === codigoProducto && p.ubicacion === ubicacion 
          ? { ...p, cantidad: p.cantidad + 1 } 
          : p
      )
    )
    const msgUbicacion = ubicacion ? ` en ${ubicacion}` : ''
    setSnackbar({ open: true, message: `${producto.nombre}: +1 unidad${msgUbicacion}`, severity: 'success' })
  } else {
    setProductosSeleccionados(prev => [
      ...prev,
      {
        producto_id: codigoProducto,
        producto_nombre: producto.nombre,
        producto_codigo: producto.codigo,
        ubicacion: ubicacion,
        cantidad: 1,
        stock_actual: producto.stock_actual
      }
    ])
    const msgUbicacion = ubicacion ? ` (${ubicacion})` : ''
    setSnackbar({ open: true, message: `${producto.nombre} agregado a la lista${msgUbicacion}`, severity: 'success' })
  }
  
  setSearchTerm('')
  setShowSearchResults(false)
}

  const handleUpdateCantidad = (index, nuevaCantidad) => {
  setProductosSeleccionados(prev =>
    prev.map((p, i) => {
      if (i === index) {
        // Permitir string vacío temporalmente
        if (nuevaCantidad === '') {
          return { ...p, cantidad: '' }
        }
        // Asegurar que sea número válido
        let cantidad = typeof nuevaCantidad === 'number' ? nuevaCantidad : parseInt(nuevaCantidad, 10)
        if (isNaN(cantidad) || cantidad < 1) {
          cantidad = 1
        }
        return { ...p, cantidad: cantidad }
      }
      return p
    })
  )
}

  const handleRemoveProducto = (index) => {
    const producto = productosSeleccionados[index]
    setProductosSeleccionados(prev => prev.filter((_, i) => i !== index))
    setSnackbar({ open: true, message: `${producto.nombre} eliminado de la lista`, severity: 'info' })
  }

  const handleClearLista = () => {
    if (productosSeleccionados.length > 0) {
      setProductosSeleccionados([])
      setSnackbar({ open: true, message: 'Lista de productos limpiada', severity: 'info' })
    }
  }

  // Agregar a entradas pendientes
  const handleAgregarAListaPendientes = () => {
    if (productosSeleccionados.length === 0) {
      setSnackbar({ open: true, message: '❌ Selecciona al menos un producto', severity: 'error' })
      return
    }
    
    if (!formData.origen_nombre.trim()) {
      setSnackbar({ open: true, message: '❌ Ingresa el proveedor/donante', severity: 'error' })
      return
    }
    
    // Confirmación
    const totalUnidades = productosSeleccionados.reduce((sum, p) => sum + p.cantidad, 0)
    let mensajeConfirmacion = ''
    
    if (productosSeleccionados.length === 1) {
      const p = productosSeleccionados[0]
      mensajeConfirmacion = `¿Agregar esta entrada?\n\n📦 Producto: ${p.nombre}\n🔢 Cantidad: ${p.cantidad} unidades\n🏢 Proveedor: ${formData.origen_nombre}`
    } else {
      mensajeConfirmacion = `¿Agregar ENTRADA MÚLTIPLE?\n\n📦 Productos: ${productosSeleccionados.length} diferentes\n🔢 Total unidades: ${totalUnidades}\n🏢 Proveedor: ${formData.origen_nombre}\n\nLista:\n${productosSeleccionados.map(p => `  • ${p.nombre}: ${p.cantidad} unidades`).join('\n')}`
    }
    
    if (!window.confirm(mensajeConfirmacion)) return
    
    // Crear entrada pendiente
    const nuevaEntrada = {
    id: Date.now(),
    tipo: productosSeleccionados.length === 1 ? 'individual' : 'multiple',
    productos: productosSeleccionados.map(p => ({
      producto_id: p.producto_id,
      producto_nombre: p.producto_nombre,
      producto_codigo: p.producto_codigo,
      ubicacion: p.ubicacion || null,  // Puede ser null
      cantidad: p.cantidad,
      stock_actual: p.stock_actual
    })),
    total_productos: productosSeleccionados.length,
    total_unidades: totalUnidades,
    motivo: formData.motivo,
    origen_nombre: formData.origen_nombre,
    notas: formData.notas,
    fecha: formData.fecha
  }
  
  console.log('✅ Nueva entrada pendiente:', nuevaEntrada)
  console.log('📦 Productos con IDs correctos:', nuevaEntrada.productos.map(p => p.producto_id))
  
  setEntradasPendientes(prev => [...prev, nuevaEntrada])
  setProductosSeleccionados([])
  setFormData(prev => ({ ...prev, ubicacion: '' }))
  setSnackbar({ open: true, message: `✅ Entrada agregada a pendientes`, severity: 'success' })
}

  const handleEliminarEntradaPendiente = (index) => {
  const entrada = entradasPendientes[index]
  if (window.confirm(`¿Eliminar esta entrada de ${entrada.productos?.length || 1} producto(s)?`)) {
    setEntradasPendientes(prev => prev.filter((_, i) => i !== index))
    setSnackbar({ open: true, message: 'Entrada eliminada de la lista', severity: 'success' })
  }
}
const handleLimpiarListaPendientes = () => {
  if (entradasPendientes.length === 0) {
    setSnackbar({ open: true, message: 'No hay entradas pendientes para limpiar', severity: 'info' })
    return
  }
  
  if (window.confirm(`¿Eliminar todas las ${entradasPendientes.length} entrada(s) pendientes?`)) {
    setEntradasPendientes([])
    setSnackbar({ open: true, message: 'Lista de entradas limpiada', severity: 'success' })
  }
}
  const handleVerDetalleEntrada = (entrada) => {
    setDetalleEntrada(entrada)
    setDetalleModalOpen(true)
  }

  // registrar entrada

const handleRegistrarEntradas = async () => {
  if (entradasPendientes.length === 0) {
    setSnackbar({ open: true, message: 'No hay entradas pendientes', severity: 'warning' })
    return
  }
  
  console.log('📋 === INICIO REGISTRO DE ENTRADAS ===')
  console.log('📋 Entradas pendientes:', JSON.stringify(entradasPendientes, null, 2))
  
  const totalUnidades = entradasPendientes.reduce((sum, e) => sum + e.total_unidades, 0)
  const confirmar = window.confirm(`¿Registrar ${entradasPendientes.length} entrada(s) con un total de ${totalUnidades} unidades?`)
  
  if (!confirmar) return
  
  setLoading(true)
  
  try {
    for (let i = 0; i < entradasPendientes.length; i++) {
      const entrada = entradasPendientes[i]
      console.log(`\n🔵 === PROCESANDO ENTRADA ${i+1} ===`)
      console.log('📦 Entrada completa:', entrada)
      
      if (entrada.tipo === 'multiple') {
        // Preparar datos para entrada múltiple
        const data = {
          productos: entrada.productos.map(p => {
            console.log(`  Producto: ${p.producto_nombre} - ID: ${p.producto_id} - Cantidad: ${p.cantidad}`)
            return {
              producto_id: p.producto_id,  // Debe ser el código (ALI1, ALI2, etc.)
              cantidad: p.cantidad
            }
          }),
          tipo_origen: entrada.motivo?.toLowerCase().includes('donación') ? 'donacion' :
                      entrada.motivo?.toLowerCase().includes('compra') ? 'compra' :
                      entrada.motivo?.toLowerCase().includes('devolución') ? 'devolucion' :
                      entrada.motivo?.toLowerCase().includes('traslado') ? 'traslado' : 'ajuste',
          origen_nombre: entrada.origen_nombre,
          ubicacion: entrada.ubicacion || '',
          observaciones: entrada.notas || '',
          usuario: 'admin'
        }
        
        console.log('📤 DATOS A ENVIAR (entrada múltiple):', JSON.stringify(data, null, 2))
        console.log('📤 Tipo de datos:', typeof data)
        console.log('📤 productos es array?', Array.isArray(data.productos))
        
        // Validar antes de enviar
        if (!data.origen_nombre || data.origen_nombre.trim() === '') {
          throw new Error('El campo "origen_nombre" es requerido')
        }
        
        if (!data.productos || data.productos.length === 0) {
          throw new Error('Debe haber al menos un producto')
        }
        
        for (const prod of data.productos) {
          if (!prod.producto_id) {
            throw new Error('Cada producto debe tener un ID')
          }
          if (!prod.cantidad || prod.cantidad <= 0) {
            throw new Error(`Cantidad inválida para producto ${prod.producto_id}`)
          }
        }
        
        await entradasService.registrarEntradaMultiple(data)
        
      } else {
        // Entrada individual
        const producto = entrada.productos[0]
        const data = {
          producto_id: producto.producto_id,
          tipo: 'entrada',
          cantidad: producto.cantidad,
          motivo: entrada.motivo,
          tipo_origen: entrada.motivo?.toLowerCase().includes('donación') ? 'donacion' :
                      entrada.motivo?.toLowerCase().includes('compra') ? 'compra' :
                      entrada.motivo?.toLowerCase().includes('devolución') ? 'devolucion' :
                      entrada.motivo?.toLowerCase().includes('traslado') ? 'traslado' : 'ajuste',
          origen_nombre: entrada.origen_nombre,
          ubicacion: entrada.ubicacion || '',
          notas: entrada.notas || '',
          usuario: 'admin'
        }
        
        console.log('📤 DATOS A ENVIAR (entrada individual):', JSON.stringify(data, null, 2))
        await entradasService.registrarEntrada(data)
      }
    }
    
    setSnackbar({ open: true, message: '✅ Entradas registradas exitosamente', severity: 'success' })
    setEntradasPendientes([])
    await cargarUltimasEntradas()
    
  } catch (error) {
    console.error('❌ ERROR COMPLETO:', error)
    console.error('❌ Response data:', error.response?.data)
    console.error('❌ Response status:', error.response?.status)
    
    let errorMsg = 'Error al registrar entradas'
    if (error.response?.data?.detail) {
      errorMsg = error.response.data.detail
    } else if (error.message) {
      errorMsg = error.message
    }
    
    setSnackbar({ open: true, message: errorMsg, severity: 'error' })
  } finally {
    setLoading(false)
  }
}

  const handleScan = async (codigo) => {
    try {
      const results = await entradasService.buscarProducto(codigo)
      
      if (results.length === 0) {
        if (window.confirm(`El código "${codigo}" no existe. ¿Deseas crear un nuevo producto?`)) {
          window.location.href = `/inventario/productos/crear?codigo=${encodeURIComponent(codigo)}`
        }
        return
      }
      
      if (results.length === 1) {
        handleSelectProduct(results[0])
      } else {
        setSearchResults(results)
        setShowSearchResults(true)
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al buscar producto', severity: 'error' })
    }
  }

  const totalUnidadesSeleccionadas = productosSeleccionados.reduce((sum, p) => {
  const cantidad = typeof p.cantidad === 'number' ? p.cantidad : (parseInt(p.cantidad, 10) || 0)
  return sum + cantidad
}, 0)
  const totalPendientes = entradasPendientes.length
  const totalUnidadesPendientes = entradasPendientes.reduce((sum, e) => sum + e.total_unidades, 0)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📥 Entrada de Productos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registra la entrada de productos al inventario
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CameraIcon />}
            onClick={() => setScannerOpen(true)}
          >
            Escanear Entrada
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarUltimasEntradas}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Columna Izquierda - Formulario */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            {/* Búsqueda de productos */}
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon /> Buscar Producto
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ingresa código o nombre del producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
              <Button variant="contained" onClick={handleSearch}>
                Buscar
              </Button>
            </Box>
            
            {/* Resultados de búsqueda */}
            {showSearchResults && searchResults.length > 0 && (
              <Paper sx={{ mb: 2, maxHeight: 300, overflow: 'auto' }}>
                {searchResults.map((producto) => (
                  <ListItem
                    key={producto.id}
                    component="div" 
                    onClick={() => handleSelectProduct(producto)}
                    sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}
                  >
                    <ListItemText
                      primary={producto.nombre}
                      secondary={`${producto.codigo} • Stock: ${producto.stock_actual}`}
                    />
                  </ListItem>
                ))}
              </Paper>
            )}
            
            {showSearchResults && searchResults.length === 0 && searchTerm && (
              <Alert severity="info" sx={{ mb: 2 }}>
                No se encontraron productos
              </Alert>
            )}
            
            {/* Productos Seleccionados */}
            {productosSeleccionados.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2, border: '1px solid', borderColor: 'primary.main' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    📦 Productos para esta entrada
                  </Typography>
                  <Chip label={productosSeleccionados.length} size="small" color="primary" />
                </Box>
                
                {productosSeleccionados.map((producto, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">{producto.producto_nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">{producto.codigo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="number"
  size="small"
  value={producto.cantidad === 0 ? '' : producto.cantidad}
  onChange={(e) => {
    const value = e.target.value
    
    if (value === '') {
      handleUpdateCantidad(index, '')
      return
    }
    
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10)
      if (numValue >= 1) {
        handleUpdateCantidad(index, numValue)
      }
    }
  }}
  onBlur={() => {
    const currentValue = producto.cantidad
    if (currentValue === '' || currentValue === 0 || currentValue < 1) {
      handleUpdateCantidad(index, 1)
    }
  }}
  sx={{ width: 80 }}
  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'center' } }}
                      />
                      <Typography variant="body2">unid.</Typography>
                      <IconButton size="small" color="error" onClick={() => handleRemoveProducto(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2">Total unidades: <strong>{totalUnidadesSeleccionadas}</strong></Typography>
                  <Button size="small" color="error" onClick={handleClearLista}>
                    Limpiar todo
                  </Button>
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            {/* Detalles de la Entrada */}
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              ✏️ Detalles de la Entrada
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Motivo de Entrada *"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                >
                  {motivos.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Proveedor / Donante / Tercero *"
                  value={formData.origen_nombre}
                  onChange={(e) => setFormData({ ...formData, origen_nombre: e.target.value })}
                  placeholder="Ej: Proveedor XYZ, Donante ABC"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Ej: Estante A1, Almacén 3"
                  helperText="Dejar vacío si no se asigna una ubicación específica"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notas Adicionales"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observaciones, número de factura, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Fecha de Entrada"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAgregarAListaPendientes}
                disabled={productosSeleccionados.length === 0}
              >
                Agregar a la Lista
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setProductosSeleccionados([])
                  setFormData({
                    ...formData,
                    origen_nombre: '',
                    ubicacion: '',
                    notas: '',
                    fecha: new Date().toISOString().slice(0, 16)
                  })
                }}
              >
                Limpiar
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Columna Derecha - Lista de Entradas Pendientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 Entradas Pendientes
                <Chip label={totalPendientes} size="small" color="primary" />
              </Typography>
            </Box>
            
            {entradasPendientes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No hay entradas pendientes
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Agrega productos usando el formulario
                </Typography>
              </Box>
            ) : (
              <>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {entradasPendientes.map((entrada, index) => (
                    <Paper key={entrada.id} sx={{ mb: 2, p: 2, bgcolor: entrada.tipo === 'multiple' ? 'info.50' : 'grey.50' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {entrada.tipo === 'multiple' ? '📦 Entrada Múltiple' : '📦 ' + entrada.productos[0].producto_nombre}
                            {entrada.tipo === 'multiple' && (
                              <Chip label={`${entrada.total_productos} prod.`} size="small" />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            🏢 {entrada.origen_nombre} • 📍 {entrada.ubicacion || 'Sin ubicación'}
                          </Typography>
                          {entrada.tipo === 'multiple' && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                              📦 {entrada.productos.map(p => `${p.producto_nombre} (${p.cantidad})`).join(', ').substring(0, 60)}...
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={`${entrada.total_unidades} unid.`} 
                            size="small" 
                            color="success" 
                          />
                          <IconButton size="small" onClick={() => handleVerDetalleEntrada(entrada)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleEliminarEntradaPendiente(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="body2">
                      Productos: <strong>{totalPendientes}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Unidades: <strong>{totalUnidadesPendientes}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Proveedor: <strong>{entradasPendientes.length === 1 ? entradasPendientes[0].origen_nombre : 'Varios'}</strong>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleLimpiarListaPendientes}
                    >
                      Limpiar Todo
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      onClick={handleRegistrarEntradas}
                      disabled={entradasPendientes.length === 0 || loading || !isSuperAdmin}
                    >
                      {loading ? 'Registrando...' : 'Registrar Entradas (Solo Super Admin)'}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
          
          {/* Historial de Últimas Entradas */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🕐 Últimas Entradas
            </Typography>
            
            {ultimasEntradas.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="text.secondary">No hay entradas registradas</Typography>
              </Box>
            ) : (
              <List dense>
                {ultimasEntradas.map((mov) => (
                  <ListItem key={mov.id} divider>
                    <ListItemText
                      primary={mov.producto?.nombre || 'Producto'}
                      secondary={`${new Date(mov.fecha_movimiento).toLocaleString()} • +${mov.cantidad} unid.`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Modal de Escáner */}
      <QRScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />
      
      {/* Modal de Detalle de Entrada */}
      <Dialog open={detalleModalOpen} onClose={() => setDetalleModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalle de Entrada
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setDetalleModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {detalleEntrada && (
            <>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Proveedor:</strong> {detalleEntrada.origen_nombre}</Typography>
                <Typography variant="body2"><strong>Motivo:</strong> {detalleEntrada.motivo}</Typography>
                <Typography variant="body2"><strong>Ubicación:</strong> {detalleEntrada.ubicacion || 'No especificada'}</Typography>
                <Typography variant="body2"><strong>Fecha:</strong> {new Date(detalleEntrada.fecha).toLocaleString()}</Typography>
                {detalleEntrada.notas && <Typography variant="body2"><strong>Notas:</strong> {detalleEntrada.notas}</Typography>}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Productos:</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detalleEntrada.productos.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{p.producto_nombre}</TableCell>
                        <TableCell>{p.producto_codigo}</TableCell>
                        <TableCell align="right">{p.cantidad}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell colSpan={2}><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>{detalleEntrada.total_unidades}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalleModalOpen(false)}>Cerrar</Button>
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
    </Container>
  )
}

export default EntradaView