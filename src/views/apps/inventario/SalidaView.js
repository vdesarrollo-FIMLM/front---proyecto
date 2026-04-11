import { useState, useEffect } from 'react'
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
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Card,
  CardContent,
  LinearProgress,
  FormControl,
  InputLabel,
  Select
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
  Warning as WarningIcon,
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Print as PrintIcon,
  ShoppingBag as KitIcon,
  Inventory as BoxIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { salidasService } from 'src/services/inventario/salidas.service'
import MultipleScannerModal from './components/MultipleScannerModal'
import { reservasService, getSessionId } from 'src/services/inventario/reservas.service'
const SalidaView = () => {
  // Estado principal
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [productosKit, setProductosKit] = useState([])
  const [salidasPendientes, setSalidasPendientes] = useState([])
  const [ultimasSalidas, setUltimasSalidas] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [scannerMultipleOpen, setScannerMultipleOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [detalleModalOpen, setDetalleModalOpen] = useState(false)
  const [detalleSalida, setDetalleSalida] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editandoSalida, setEditandoSalida] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfInfoMap, setPdfInfoMap] = useState({})
  
  // Formulario
  const [formData, setFormData] = useState({
    motivo: 'Entrega de Ayudas',
    cantidad: 1,
    cliente: '',
    kitNombre: '',
    cantidadKits: 1,
    notas: '',
    fecha: new Date().toISOString().slice(0, 16)
  })

  // Formulario de edición
  const [editFormData, setEditFormData] = useState({
    motivo: '',
    cliente: '',
    notas: '',
    fecha: ''
  })
  const [editProductosKit, setEditProductosKit] = useState([])
  const [editSearchTerm, setEditSearchTerm] = useState('')
  const [editSearchResults, setEditSearchResults] = useState([])
  const [editShowSearchResults, setEditShowSearchResults] = useState(false)
  const [editCantidad, setEditCantidad] = useState(1)

  const motivos = [
    'Entrega de Ayudas',
    'Consumo Interno',
    'Dañado',
    'Caducado',
    'Ajuste de Inventario',
    'Transferencia',
    'Otro'
  ]

  const isModoKit = formData.motivo === 'Entrega de Ayudas'

  // Cargar historial al iniciar
useEffect(() => {
  cargarUltimasSalidas()
  cargarReservaPendiente()  // Nueva función
}, [])

const cargarReservaPendiente = async () => {
  try {
    const reserva = await reservasService.obtenerReserva()
    if (reserva && reserva.items && reserva.items.length > 0) {
      console.log('🔄 Cargando reserva pendiente:', reserva)
      
      // Obtener stock actualizado para cada producto
      const itemsConStockActualizado = await Promise.all(
        reserva.items.map(async (item) => {
          const stockInfo = await reservasService.getStockDisponible(item.producto_id)
          return {
            ...item,
            stock_actual: stockInfo.stock_disponible,
            stock_fisico: stockInfo.stock_fisico
          }
        })
      )
      
      const itemsPendientes = itemsConStockActualizado.map(item => ({
        id: Date.now() + Math.random(),
        tipo: 'normal',
        producto_id: item.producto_id,
        producto_nombre: item.producto_nombre,
        producto_codigo: item.producto_codigo,
        cantidad: item.cantidad,
        motivo: 'Entrega de Ayudas',
        cliente: reserva.datos_adicionales?.cliente || '',
        notas: reserva.datos_adicionales?.notas || '',
        fecha: reserva.datos_adicionales?.fecha || new Date().toISOString().slice(0, 16),
        stock_restante: item.stock_actual - item.cantidad,
        stock_actual: item.stock_actual,
        stock_fisico: item.stock_fisico,
        stock_minimo: item.stock_minimo || 5
      }))
      
      setSalidasPendientes(itemsPendientes)
    }
  } catch (error) {
    console.error('Error cargando reserva:', error)
  }
}
  const cargarUltimasSalidas = async () => {
    try {
      const salidas = await salidasService.getUltimasSalidas(15)
      setUltimasSalidas(salidas)
      
      const pdfInfoPromises = salidas.map(async (mov) => {
        try {
          const info = await salidasService.getPDFInfo(mov.id)
          return { id: mov.id, info }
        } catch (error) {
          return { id: mov.id, info: { tiene_pdf: false } }
        }
      })
      
      const resultados = await Promise.all(pdfInfoPromises)
      const pdfMap = {}
      resultados.forEach(({ id, info }) => {
        pdfMap[id] = info
      })
      setPdfInfoMap(pdfMap)
      
    } catch (error) {
      console.error('Error cargando historial:', error)
    }
  }

  // Búsqueda de productos
  // Modificar handleSearch para obtener stock disponible
const handleSearch = async () => {
  if (!searchTerm.trim()) return
  
  try {
    const results = await salidasService.buscarProducto(searchTerm)
    
    // Para cada producto, obtener el stock disponible
    const resultsConStockDisponible = await Promise.all(
      results.map(async (producto) => {
        try {
          const stockInfo = await reservasService.getStockDisponible(producto.codigo)
          return {
            ...producto,
            stock_actual: stockInfo.stock_disponible,  // Mostrar stock disponible
            stock_fisico: stockInfo.stock_fisico,      // Guardar stock físico para referencia
            stock_reservado_otros: stockInfo.stock_reservado_otros
          }
        } catch (error) {
          return producto
        }
      })
    )
    
    setSearchResults(resultsConStockDisponible)
    setShowSearchResults(true)
  } catch (error) {
    setSnackbar({ open: true, message: 'Error al buscar producto', severity: 'error' })
  }
}

  const handleSelectProduct = (producto) => {
  if (isModoKit) {
    const existente = productosKit.find(p => p.id === producto.id)
    
    if (existente) {
      setProductosKit(prev =>
        prev.map(p =>
          p.id === producto.id ? { ...p, cantidad_por_kit: p.cantidad_por_kit + 1 } : p
        )
      )
      setSnackbar({ open: true, message: `${producto.nombre}: +1 unidad por kit`, severity: 'success' })
    } else {
      setProductosKit(prev => [
        ...prev,
        {
          ...producto,
          cantidad_por_kit: 1
        }
      ])
      setSnackbar({ open: true, message: `${producto.nombre} agregado al kit`, severity: 'success' })
    }
  } else {
    setProductoSeleccionado(producto)
    setFormData(prev => ({ ...prev, cantidad: 1 }))
    setSnackbar({ open: true, message: `Producto seleccionado: ${producto.nombre}`, severity: 'success' })
  }
  
  setSearchTerm('')
  setShowSearchResults(false)
}

  const handleUpdateCantidadKit = (index, nuevaCantidad) => {
  const cantidad = parseInt(nuevaCantidad) || 1
  if (cantidad > 0) {
    setProductosKit(prev =>
      prev.map((p, i) => i === index ? { ...p, cantidad_por_kit: cantidad } : p)
    )
  }
}

const handleRemoveProductoKit = (index) => {
  const producto = productosKit[index]
  setProductosKit(prev => prev.filter((_, i) => i !== index))
  setSnackbar({ open: true, message: `${producto.nombre} eliminado del kit`, severity: 'info' })
}

  const handleClearKit = () => {
  if (productosKit.length > 0) {
    setProductosKit([])
    setSnackbar({ open: true, message: 'Kit limpiado', severity: 'info' })
  }
}

const handleClearForm = () => {
  setProductoSeleccionado(null)
  setProductosKit([])
  setFormData({
    motivo: 'Entrega de Ayudas',
    cantidad: 1,
    cliente: '',
    kitNombre: '',
    cantidadKits: 1,
    notas: '',
    fecha: new Date().toISOString().slice(0, 16)
  })
  setSearchTerm('')
  setShowSearchResults(false)
}

// Verificar stock
const verificarStock = () => {
  if (!productoSeleccionado) return { valido: true, mensaje: '' }
  
  const cantidad = formData.cantidad
  if (cantidad > productoSeleccionado.stock_actual) {
    return {
      valido: false,
      mensaje: `Stock insuficiente. Disponible: ${productoSeleccionado.stock_actual}, Solicitado: ${cantidad}`
    }
  }
  
  const porcentaje = (cantidad / productoSeleccionado.stock_actual) * 100
  if (porcentaje > 80) {
    return {
      valido: true,
      advertencia: `⚠️ Estás retirando ${cantidad} de ${productoSeleccionado.stock_actual} unidades (${Math.round(porcentaje)}% del stock). Quedarán solo ${productoSeleccionado.stock_actual - cantidad} unidades.`
    }
  }
  
  return { valido: true, mensaje: '' }
}

const verificarStockKit = () => {
  const cantidadKits = formData.cantidadKits
  const errores = []
  
  productosKit.forEach(producto => {
    const totalNecesario = producto.cantidad_por_kit * cantidadKits
    if (totalNecesario > producto.stock_actual) {
      errores.push({
        nombre: producto.nombre,
        necesario: totalNecesario,
        disponible: producto.stock_actual,
        porKit: producto.cantidad_por_kit
      })
    }
  })
  
  return { errores, valido: errores.length === 0 }
}

  // Agregar a lista de pendientes
  const handleAgregarALista = async () => {
  if (isModoKit) {
    if (productosKit.length === 0) {
      setSnackbar({ open: true, message: '❌ Selecciona al menos un producto para el kit', severity: 'error' })
      return
    }
    
    if (!formData.kitNombre.trim()) {
      setSnackbar({ open: true, message: '❌ Ingresa un nombre para el kit', severity: 'error' })
      return
    }
    
    if (!formData.cliente.trim()) {
      setSnackbar({ open: true, message: '❌ Ingresa el nombre del beneficiario', severity: 'error' })
      return
    }
    
    const stockCheck = verificarStockKit()
    if (!stockCheck.valido) {
      let mensaje = 'Stock insuficiente:\n\n'
      stockCheck.errores.forEach(e => {
        mensaje += `• ${e.nombre}: Necesario ${e.porKit} × ${formData.cantidadKits} kits = ${e.necesario} unidades, Disponible: ${e.disponible}\n`
      })
      alert(mensaje)
      return
    }
    
    const kit = {
      id: Date.now(),
      tipo: 'kit',
      nombre: formData.kitNombre,
      cantidad_kits: formData.cantidadKits,
      motivo: formData.motivo,
      cliente: formData.cliente,
      notas: formData.notas,
      fecha: formData.fecha,
      productos: productosKit.map(p => ({
        id: p.id,
        producto_id: p.codigo,
        producto_nombre: p.nombre,
        producto_codigo: p.codigo,
        cantidad_por_kit: p.cantidad_por_kit,
        cantidad_total: p.cantidad_por_kit * formData.cantidadKits,
        stock_disponible: p.stock_actual,
        stock_actual: p.stock_actual,
        stock_minimo: p.stock_minimo || 5
      }))
    }
    
    setSalidasPendientes(prev => [...prev, kit])
    
    const itemsParaReserva = kit.productos.map(p => ({
      producto_id: p.producto_id,
      producto_nombre: p.producto_nombre,
      producto_codigo: p.producto_codigo,
      cantidad: p.cantidad_total,
      stock_actual: p.stock_actual,
      stock_minimo: p.stock_minimo || 5
    }))
    
    try {
      await reservasService.guardarReserva(itemsParaReserva, {
        tipo: 'kit',
        kitNombre: kit.nombre,
        cliente: kit.cliente,
        notas: kit.notas,
        fecha: kit.fecha
      })
      reservasService.clearCache()
      setSnackbar({ open: true, message: `✅ Kit "${formData.kitNombre}" agregado y stock reservado`, severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: `❌ Error reservando stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
      return
    }
    
    handleClearForm()
    
  } else {
    // Salida normal
    if (!productoSeleccionado) {
      setSnackbar({ open: true, message: '❌ Selecciona un producto primero', severity: 'error' })
      return
    }
    
   // Obtener stock disponible actualizado
    const stockInfo = await reservasService.getStockDisponible(productoSeleccionado.codigo)
    const stockDisponible = stockInfo.stock_disponible
    
    if (formData.cantidad > stockDisponible) {
      setSnackbar({ 
        open: true, 
        message: `❌ Stock insuficiente. Disponible: ${stockDisponible}, Solicitado: ${formData.cantidad}`,
        severity: 'error'
      })
      return
    }
    
    const salida = {
      id: Date.now(),
      tipo: 'normal',
      producto: productoSeleccionado,
      producto_id: productoSeleccionado.codigo,
      cantidad: formData.cantidad,
      motivo: formData.motivo,
      cliente: formData.cliente,
      notas: formData.notas,
      fecha: formData.fecha,
      stock_restante: productoSeleccionado.stock_actual - formData.cantidad,
      producto_nombre: productoSeleccionado.nombre,
      producto_codigo: productoSeleccionado.codigo,
      stock_actual: productoSeleccionado.stock_actual,
      stock_minimo: productoSeleccionado.stock_minimo
    }
    
    setSalidasPendientes(prev => [...prev, salida])
    
    const itemsParaReserva = [{
      producto_id: salida.producto_id,
      producto_nombre: salida.producto_nombre,
      producto_codigo: salida.producto_codigo,
      cantidad: salida.cantidad,
      stock_actual: salida.stock_actual,
      stock_minimo: salida.stock_minimo
    }]
    
    try {
      await reservasService.guardarReserva(itemsParaReserva, {
        tipo: 'normal',
        cliente: salida.cliente,
        notas: salida.notas,
        fecha: salida.fecha
      })
      setSnackbar({ open: true, message: `✅ ${formData.cantidad} unidades reservadas de "${productoSeleccionado.nombre}"`, severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: `❌ Error reservando stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
      return
    }
    
    handleClearForm()
  }
}

  // 🆕 CONFIRMAR SALIDA INDIVIDUAL
  const handleConfirmarSalida = async (item, index) => {
  setLoading(true)
  
  try {
    // Confirmar la reserva completa
    const resultado = await reservasService.confirmarReserva()
    
    if (resultado.success) {
      setSnackbar({ 
        open: true, 
        message: `✅ ${resultado.movimientos.length} salida(s) confirmada(s)`, 
        severity: 'success' 
      })
      // Eliminar SOLO este item de la lista (no todas)
      setSalidasPendientes(prev => prev.filter((_, i) => i !== index))
      
      // Actualizar historial en segundo plano
      await cargarUltimasSalidas()
      
      // Limpiar caché
      reservasService.clearCache()
      
    } else {
      throw new Error(resultado.message || 'Error al confirmar')
    }
    
  } catch (error) {
    setSnackbar({ 
      open: true, 
      message: `❌ Error al confirmar: ${error.response?.data?.detail || error.message}`, 
      severity: 'error' 
    })
  } finally {
    setLoading(false)
  }
}

  // Reemplazar handleEliminarPendiente
const handleEliminarPendiente = async (index) => {
  const item = salidasPendientes[index]
  if (window.confirm(`¿Eliminar ${item.tipo === 'kit' ? `kit "${item.nombre}"` : `salida de ${item.cantidad} unidades de "${item.producto_nombre}"`} de la lista de pendientes?`)) {
    
    // Calcular los productos a liberar (solo los de esta salida)
    const ajustes = []
    
    if (item.tipo === 'kit') {
      // Para kit: liberar todos los productos del kit
      for (const producto of item.productos) {
        ajustes.push({
          producto_id: producto.producto_id,
          diferencia: -producto.cantidad_total,  // Negativo = liberar
          producto_nombre: producto.producto_nombre,
          producto_codigo: producto.producto_codigo
        })
      }
    } else {
      // Para salida normal: liberar el producto individual
      ajustes.push({
        producto_id: item.producto_id,
        diferencia: -item.cantidad,  // Negativo = liberar
        producto_nombre: item.producto_nombre,
        producto_codigo: item.producto_codigo
      })
    }
    
    try {
      // Enviar ajustes negativos para liberar el stock
      await reservasService.ajustarReserva(ajustes, {
        tipo: 'eliminacion',
        motivo: 'Salida cancelada'
      })
      
      // Eliminar SOLO este item de la lista local
      setSalidasPendientes(prev => prev.filter((_, i) => i !== index))
      
      const mensajes = ajustes.map(a => 
        `${a.producto_nombre}: ${Math.abs(a.diferencia)} unidades liberadas`
      )
      setSnackbar({ open: true, message: `✅ Stock liberado: ${mensajes.join(', ')}`, severity: 'success' })
      
      // Esto actualiza los datos del dashboard si es necesario
      if (typeof cargarUltimasSalidas === 'function') {
        cargarUltimasSalidas() // Actualizar historial
      }
      
      // Limpiar caché de stock para que las próximas búsquedas tengan datos frescos
      reservasService.clearCache()
      
    } catch (error) {
      setSnackbar({ open: true, message: `Error al liberar stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
    }
  }
}

// ==========================================
// EDITAR SALIDA
// ==========================================
const handleEditarSalida = (item) => {
  setEditandoSalida(item)
  
  if (item.tipo === 'kit') {
    setEditFormData({
      motivo: item.motivo,
      cliente: item.cliente,
      notas: item.notas || '',
      fecha: item.fecha
    })
    setEditProductosKit([...item.productos])
    setEditCantidad(item.cantidad_kits)
  } else {
    setEditFormData({
      motivo: item.motivo,
      cliente: item.cliente || '',
      notas: item.notas || '',
      fecha: item.fecha
    })
    setEditCantidad(item.cantidad)
    setEditProductosKit([])
  }
  setEditModalOpen(true)
}

// ==========================================
// GUARDAR EDICIÓN (CORREGIDO)
// ==========================================
const handleGuardarEdicion = async () => {
  if (!editandoSalida) return
  
  const updatedItem = { ...editandoSalida }
  const ajustes = [] // Para guardar las diferencias
  
  if (editandoSalida.tipo === 'kit') {
    updatedItem.motivo = editFormData.motivo
    updatedItem.cliente = editFormData.cliente
    updatedItem.notas = editFormData.notas
    updatedItem.fecha = editFormData.fecha
    updatedItem.cantidad_kits = editCantidad
    
    // Calcular diferencias por producto
    const productosOriginales = {}
    editandoSalida.productos.forEach(p => {
      productosOriginales[p.producto_id] = p.cantidad_total
    })
    
    updatedItem.productos = editProductosKit.map(p => ({
      ...p,
      cantidad_total: p.cantidad_por_kit * editCantidad
    }))
    updatedItem.total_unidades = updatedItem.productos.reduce((sum, p) => sum + p.cantidad_total, 0)
    
    // Calcular ajustes (diferencia entre nueva y original)
    for (const producto of updatedItem.productos) {
      const cantidadOriginal = productosOriginales[producto.producto_id] || 0
      const cantidadNueva = producto.cantidad_total
      const diferencia = cantidadNueva - cantidadOriginal
      
      if (diferencia !== 0) {
        ajustes.push({
          producto_id: producto.producto_id,
          diferencia: diferencia,  // Positivo = reservar más, Negativo = liberar
          producto_nombre: producto.producto_nombre,
          producto_codigo: producto.producto_codigo
        })
      }
    }
    
    // También verificar productos que fueron eliminados
    for (const [productoId, cantidadOriginal] of Object.entries(productosOriginales)) {
      const existe = updatedItem.productos.find(p => p.producto_id === productoId)
      if (!existe) {
        ajustes.push({
          producto_id: productoId,
          diferencia: -cantidadOriginal,  // Liberar todo
          producto_nombre: editandoSalida.productos.find(p => p.producto_id === productoId)?.producto_nombre || productoId,
          producto_codigo: editandoSalida.productos.find(p => p.producto_id === productoId)?.producto_codigo || productoId
        })
      }
    }
    
  } else {
    // Salida normal
    const cantidadOriginal = editandoSalida.cantidad
    const cantidadNueva = editCantidad
    const diferencia = cantidadNueva - cantidadOriginal
    
    updatedItem.motivo = editFormData.motivo
    updatedItem.cliente = editFormData.cliente
    updatedItem.notas = editFormData.notas
    updatedItem.fecha = editFormData.fecha
    updatedItem.cantidad = editCantidad
    updatedItem.stock_restante = updatedItem.stock_actual - editCantidad
    
    if (diferencia !== 0) {
      ajustes.push({
        producto_id: editandoSalida.producto_id,
        diferencia: diferencia,
        producto_nombre: editandoSalida.producto_nombre,
        producto_codigo: editandoSalida.producto_codigo
      })
    }
  }
  
  // Actualizar la lista local
  const nuevasPendientes = [...salidasPendientes]
  const index = salidasPendientes.findIndex(s => s.id === editandoSalida.id)
  if (index !== -1) {
    nuevasPendientes[index] = updatedItem
    setSalidasPendientes(nuevasPendientes)
    
    if (ajustes.length > 0) {
      try {
        // Enviar los ajustes al backend
        await reservasService.ajustarReserva(ajustes, {
          tipo: 'edicion',
          cliente: updatedItem.cliente,
          notas: updatedItem.notas,
          fecha: updatedItem.fecha
        })
        
        const mensajes = ajustes.map(a => {
          if (a.diferencia > 0) {
            return `${a.producto_nombre}: +${a.diferencia} unidades reservadas`
          } else {
            return `${a.producto_nombre}: ${Math.abs(a.diferencia)} unidades liberadas`
          }
        })
        setSnackbar({ open: true, message: `✅ Stock actualizado: ${mensajes.join(', ')}`, severity: 'success' })
        
      } catch (error) {
        setSnackbar({ open: true, message: `Error actualizando reserva: ${error.response?.data?.detail || error.message}`, severity: 'error' })
      }
    }
  }
  
  setEditModalOpen(false)
  setEditandoSalida(null)
}
// ==========================================
// ACTUALIZAR CANTIDAD EN KIT DURANTE EDICIÓN
// ==========================================
const handleEditUpdateCantidadKit = (index, nuevaCantidad) => {
  const cantidad = parseInt(nuevaCantidad) || 1
  if (cantidad > 0) {
    const nuevosProductos = [...editProductosKit]
    nuevosProductos[index].cantidad_por_kit = cantidad
    nuevosProductos[index].cantidad_total = cantidad * editCantidad
    setEditProductosKit(nuevosProductos)
  }
}

// ==========================================
// ELIMINAR PRODUCTO DEL KIT EN EDICIÓN
// ==========================================
const handleEditRemoveProductoKit = (index) => {
  const nuevosProductos = editProductosKit.filter((_, i) => i !== index)
  setEditProductosKit(nuevosProductos)
}

// ==========================================
// BUSCAR PRODUCTO PARA AGREGAR A SALIDA EXISTENTE
// ==========================================
const handleEditSearch = async () => {
  if (!editSearchTerm.trim()) return
  
  try {
    const results = await salidasService.buscarProducto(editSearchTerm)
    setEditSearchResults(results)
    setEditShowSearchResults(true)
  } catch (error) {
    setSnackbar({ open: true, message: 'Error al buscar producto', severity: 'error' })
  }
}

// ==========================================
// AGREGAR PRODUCTO A LA SALIDA QUE SE ESTÁ EDITANDO
// ==========================================
const handleAgregarProductoAEdicion = (producto) => {
  if (editandoSalida.tipo === 'kit') {
    const existente = editProductosKit.find(p => p.producto_id === producto.id)
    if (existente) {
      const nuevosProductos = editProductosKit.map(p =>
        p.producto_id === producto.id 
          ? { ...p, cantidad_por_kit: p.cantidad_por_kit + 1, cantidad_total: (p.cantidad_por_kit + 1) * editCantidad }
          : p
      )
      setEditProductosKit(nuevosProductos)
      setSnackbar({ open: true, message: `${producto.nombre}: +1 unidad por kit`, severity: 'success' })
    } else {
      setEditProductosKit(prev => [
        ...prev,
        {
          producto_id: producto.id,
          producto_nombre: producto.nombre,
          producto_codigo: producto.codigo,
          cantidad_por_kit: 1,
          cantidad_total: 1 * editCantidad,
          stock_disponible: producto.stock_actual
        }
      ])
      setSnackbar({ open: true, message: `${producto.nombre} agregado al kit`, severity: 'success' })
    }
  } else {
    const confirmar = window.confirm(
      `Esta salida actualmente tiene el producto "${editandoSalida.producto_nombre}".\n\n` +
      `¿Deseas agregar "${producto.nombre}"? Esto convertirá la salida en un KIT con múltiples productos.\n\n` +
      `¿Continuar?`
    )
    
    if (confirmar) {
      const nuevosProductos = [
        {
          producto_id: editandoSalida.producto_id,
          producto_nombre: editandoSalida.producto_nombre,
          producto_codigo: editandoSalida.producto_codigo,
          cantidad_por_kit: editandoSalida.cantidad,
          cantidad_total: editandoSalida.cantidad,
          stock_disponible: editandoSalida.stock_actual
        },
        {
          producto_id: producto.id,
          producto_nombre: producto.nombre,
          producto_codigo: producto.codigo,
          cantidad_por_kit: 1,
          cantidad_total: 1,
          stock_disponible: producto.stock_actual
        }
      ]
      
      setEditandoSalida(prev => ({
        ...prev,
        tipo: 'kit',
        nombre: `Kit múltiple (${editandoSalida.producto_nombre} + ${producto.nombre})`,
        productos: nuevosProductos,
        cantidad_kits: 1
      }))
      setEditProductosKit(nuevosProductos)
      setEditCantidad(1)
      setSnackbar({ open: true, message: `Salida convertida a KIT con 2 productos`, severity: 'success' })
    }
  }
  
  setEditSearchTerm('')
  setEditShowSearchResults(false)
}

const handleVerDetallePendiente = (item) => {
  setDetalleSalida(item)
  setDetalleModalOpen(true)
}
  // Generar PDF para una salida específica
  const handleGenerarComprobante = async (movimientoId) => {
    setPdfLoading(true)
    try {
      const blob = await salidasService.generarComprobanteSalida(movimientoId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `comprobante_salida_${movimientoId}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setSnackbar({ open: true, message: '✅ Comprobante generado', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al generar comprobante', severity: 'error' })
    } finally {
      setPdfLoading(false)
    }
  }

  // Subir PDF firmado
  const handleSubirPDFFirmado = async (movimientoId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      
      if (file.type !== 'application/pdf') {
        alert('❌ Solo se permiten archivos PDF')
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ El archivo es demasiado grande. Máximo 10MB')
        return
      }
      
      if (!confirm(`¿Subir PDF firmado para esta salida?\n\nArchivo: ${file.name}\nTamaño: ${(file.size / 1024 / 1024).toFixed(2)}MB`)) {
        return
      }
      
      setPdfLoading(true)
      try {
        await salidasService.subirPDFFirmado(movimientoId, file)
        setSnackbar({ open: true, message: '✅ PDF firmado subido exitosamente', severity: 'success' })
        await cargarUltimasSalidas()
      } catch (error) {
        setSnackbar({ open: true, message: 'Error al subir PDF', severity: 'error' })
      } finally {
        setPdfLoading(false)
      }
    }
    
    input.click()
  }

  const handleScanMultiple = (productos) => {
    if (isModoKit) {
      productos.forEach(producto => {
        const existente = productosKit.find(p => p.id === producto.id)
        if (existente) {
          setProductosKit(prev =>
            prev.map(p =>
              p.id === producto.id ? { ...p, cantidad_por_kit: p.cantidad_por_kit + producto.cantidad_retirar } : p
            )
          )
        } else {
          setProductosKit(prev => [
            ...prev,
            {
              id: producto.id,
              nombre: producto.nombre,
              codigo: producto.codigo,
              stock_actual: producto.stock_actual,
              cantidad_por_kit: producto.cantidad_retirar
            }
          ])
        }
      })
      setSnackbar({ open: true, message: `${productos.length} productos agregados al kit`, severity: 'success' })
    } else {
      const nuevasSalidas = productos.map(producto => ({
        id: Date.now() + Math.random(),
        tipo: 'normal',
        producto: producto,
        producto_id: producto.id,
        producto_nombre: producto.nombre,
        producto_codigo: producto.codigo,
        cantidad: producto.cantidad_retirar,
        motivo: formData.motivo,
        cliente: formData.cliente,
        notas: formData.notas,
        fecha: formData.fecha,
        stock_restante: producto.stock_actual - producto.cantidad_retirar,
        stock_actual: producto.stock_actual,
        stock_minimo: producto.stock_minimo
      }))
      setSalidasPendientes(prev => [...prev, ...nuevasSalidas])
      setSnackbar({ open: true, message: `${productos.length} productos agregados a pendientes`, severity: 'success' })
    }
  }

  const totalPendientes = salidasPendientes.length
  const totalUnidadesPendientes = salidasPendientes.reduce((sum, s) => {
    if (s.tipo === 'kit') {
      return sum + s.productos.reduce((ss, p) => ss + p.cantidad_total, 0)
    }
    return sum + s.cantidad
  }, 0)
  const totalKits = salidasPendientes.filter(s => s.tipo === 'kit').length

  const stockCheck = verificarStock()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📤 Salida de Productos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registra la salida de productos del inventario
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<CameraIcon />}
            onClick={() => setScannerMultipleOpen(true)}
          >
            Escanear Múltiple
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarUltimasSalidas}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Alerta de verificación de stock */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Verificación de stock:</strong> El sistema validará que haya suficiente stock antes de registrar cada salida.
      </Alert>

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
                    button
                    onClick={() => handleSelectProduct(producto)}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
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
            
            {/* Producto Seleccionado (Modo Normal) */}
            {!isModoKit && productoSeleccionado && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 2, border: '1px solid', borderColor: 'primary.main' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {productoSeleccionado.nombre}
                  </Typography>
                  <IconButton size="small" onClick={() => setProductoSeleccionado(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Código: {productoSeleccionado.codigo}
                </Typography>
                <Typography variant="caption" color={productoSeleccionado.stock_actual <= (productoSeleccionado.stock_minimo || 5) ? 'error' : 'text.secondary'}>
                  Stock disponible: {productoSeleccionado.stock_actual}
                </Typography>
                {stockCheck.advertencia && (
                  <Alert severity="warning" sx={{ mt: 1 }}>{stockCheck.advertencia}</Alert>
                )}
              </Box>
            )}
            
            {/* Productos del Kit (Modo Kit) */}
            {isModoKit && productosKit.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.main' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <KitIcon /> Productos del Kit
                    <Chip label={productosKit.length} size="small" color="success" />
                  </Typography>
                  <Button size="small" color="error" onClick={handleClearKit}>
                    Limpiar
                  </Button>
                </Box>
                
                {productosKit.map((producto, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">{producto.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">{producto.codigo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={producto.cantidad_por_kit}
                        onChange={(e) => handleUpdateCantidadKit(index, e.target.value)}
                        sx={{ width: 80 }}
                        inputProps={{ min: 1 }}
                      />
                      <Typography variant="body2">unid/kit</Typography>
                      <IconButton size="small" color="error" onClick={() => handleRemoveProductoKit(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            {/* Detalles de la Salida */}
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              ✏️ Detalles de la Salida
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Motivo de Salida *"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                >
                  {motivos.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {!isModoKit && (
                <Grid item xs={12}>
                  <TextField
      fullWidth
      type="number"
      label="Cantidad *"
      value={formData.cantidad === 0 ? '' : formData.cantidad}
      onChange={(e) => {
        const value = e.target.value
        // Permitir vacío temporalmente para que el usuario pueda escribir
        if (value === '') {
          setFormData(prev => ({ ...prev, cantidad: '' }))
        } else {
          const numValue = parseInt(value, 10)
          if (!isNaN(numValue) && numValue > 0) {
            setFormData(prev => ({ ...prev, cantidad: numValue }))
          }
        }
      }}
      onBlur={() => {
        // Al salir del campo, si está vacío o inválido, poner 1
        if (!formData.cantidad || formData.cantidad <= 0) {
          setFormData(prev => ({ ...prev, cantidad: 1 }))
        }
      }}
      inputProps={{ 
        min: 1, 
        step: 1,
        // Esto evita que el navegador muestre el spinner que causa problemas
        style: { appearance: 'textfield', MozAppearance: 'textfield' }
      }}
      error={!stockCheck.valido}
      helperText={!stockCheck.valido ? stockCheck.mensaje : `Stock disponible: ${productoSeleccionado?.stock_actual || 0}`}
                  />
                </Grid>
              )}
              
              {isModoKit && (
                <>
                  <Grid item xs={12}>
                    <TextField
        fullWidth
        label="Nombre del Kit/Mercado *"
        value={formData.kitNombre}
        onChange={(e) => setFormData({ ...formData, kitNombre: e.target.value })}
        placeholder="Ej: Mercado Básico, Kit Emergencia, Ayuda Familiar"
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        type="number"
        label="Cantidad de Kits *"
        value={formData.cantidadKits}
    onChange={(e) => {
      const value = e.target.value
          if (value === '') {
            setFormData(prev => ({ ...prev, cantidadKits: '' }))
          } else {
            const numValue = parseInt(value, 10)
            if (!isNaN(numValue) && numValue > 0) {
              setFormData(prev => ({ ...prev, cantidadKits: numValue }))
            }
          }
        }}
        onBlur={() => {
          if (!formData.cantidadKits || formData.cantidadKits <= 0) {
            setFormData(prev => ({ ...prev, cantidadKits: 1 }))
          }
        }}
        inputProps={{ 
          min: 1, 
          step: 1,
          style: { appearance: 'textfield', MozAppearance: 'textfield' }
        }}
  />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cliente/Destino"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  placeholder={isModoKit ? "Nombre del beneficiario *" : "Nombre del cliente o destino..."}
                  required={isModoKit}
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
                  label="Fecha de Salida"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<AddIcon />}
                onClick={handleAgregarALista}
                disabled={(!isModoKit && !productoSeleccionado) || (isModoKit && productosKit.length === 0) || (isModoKit && !formData.kitNombre)}
              >
                Agregar a la Lista
              </Button>
              <Button variant="outlined" onClick={handleClearForm}>
                Limpiar
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Columna Derecha - Lista de Salidas Pendientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 Salidas Pendientes
                <Chip label={totalPendientes} size="small" color="warning" />
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total unidades: {totalUnidadesPendientes}
              </Typography>
            </Box>
            
            {salidasPendientes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No hay salidas pendientes
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Agrega productos usando el formulario
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                {salidasPendientes.map((item, index) => (
                  <Paper key={item.id} sx={{ mb: 2, p: 2, bgcolor: item.tipo === 'kit' ? 'info.50' : 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        {item.tipo === 'kit' ? (
                          <>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <KitIcon /> {item.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {item.motivo} • Beneficiario: {item.cliente || 'No especificado'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {item.cantidad_kits} kits × {item.productos.length} productos ({item.productos.reduce((sum, p) => sum + p.cantidad_total, 0)} unidades totales)
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {item.producto_nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {item.motivo} • {item.cliente ? `Destino: ${item.cliente}` : ''}
                            </Typography>
                            <Typography variant="caption" color={item.stock_restante <= (item.stock_minimo || 5) ? 'error' : 'text.secondary'}>
                              Stock restante disponible: {item.stock_restante} unidades
  {item.stock_fisico && item.stock_fisico !== item.stock_actual && (
    <span style={{ fontSize: '10px', display: 'block', color: '#666' }}>
      (Stock físico: {item.stock_fisico} | Reservado: {item.stock_fisico - item.stock_actual})
    </span>
  )}
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={item.tipo === 'kit' ? `${item.cantidad_kits} kits` : `${item.cantidad} unid.`} 
                          size="small" 
                          color="warning" 
                        />
                        <IconButton size="small" onClick={() => handleVerDetallePendiente(item)} title="Ver detalles">
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEditarSalida(item)} title="Editar" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="success" onClick={() => handleConfirmarSalida(item, index)} title="Confirmar salida" disabled={loading}>
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleEliminarPendiente(index)} title="Eliminar">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </List>
            )}
          </Paper>
          
          {/* Historial de Últimas Salidas */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🕐 Últimas Salidas
            </Typography>
            
            {pdfLoading && <LinearProgress sx={{ mb: 2 }} />}
            
            {ultimasSalidas.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="text.secondary">No hay salidas registradas</Typography>
              </Box>
            ) : (
              <List dense>
                {ultimasSalidas.map((mov) => {
                  const pdfInfo = pdfInfoMap[mov.id] || { tiene_pdf: false }
                  const tienePDF = pdfInfo.tiene_pdf
                  
                  return (
                    <ListItem key={mov.id} divider sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(mov.fecha_movimiento).toLocaleString()}
                          </Typography>
                          <Typography variant="subtitle2">
                            {mov.producto?.nombre || 'Producto ID: ' + mov.producto_id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {mov.cliente_destino || 'Sin destino'} • {mov.motivo || 'Sin motivo'}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={`-${mov.cantidad}`} 
                            size="small" 
                            color="warning"
                          />
                          {tienePDF && (
                            <Chip 
                              icon={<PdfIcon />} 
                              label="PDF" 
                              size="small" 
                              color="success"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          startIcon={<PrintIcon />}
                          onClick={() => handleGenerarComprobante(mov.id)}
                          disabled={pdfLoading}
                        >
                          Comprobante
                        </Button>
                        {tienePDF ? (
                          <Button
                            size="small"
                            startIcon={<PdfIcon />}
                            onClick={() => window.open(pdfInfo.pdf_url, '_blank')}
                          >
                            Ver PDF
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            startIcon={<UploadIcon />}
                            onClick={() => handleSubirPDFFirmado(mov.id)}
                            disabled={pdfLoading}
                          >
                            Subir PDF
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                  )
                })}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Modal de Escáner Múltiple */}
      <MultipleScannerModal
        open={scannerMultipleOpen}
        onClose={() => setScannerMultipleOpen(false)}
        onProductosAgregados={handleScanMultiple}
      />
      
      {/* Modal de Detalle de Salida */}
      <Dialog open={detalleModalOpen} onClose={() => setDetalleModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalle de Salida
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setDetalleModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {detalleSalida && (
            <>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Motivo:</strong> {detalleSalida.motivo}</Typography>
                <Typography variant="body2"><strong>Cliente/Destino:</strong> {detalleSalida.cliente || 'No especificado'}</Typography>
                <Typography variant="body2"><strong>Fecha:</strong> {new Date(detalleSalida.fecha).toLocaleString()}</Typography>
                {detalleSalida.notas && <Typography variant="body2"><strong>Notas:</strong> {detalleSalida.notas}</Typography>}
              </Box>
              
              {detalleSalida.tipo === 'kit' ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>Productos del Kit:</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell>Código</TableCell>
                          <TableCell align="right">Unid/Kit</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detalleSalida.productos.map((p, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{p.producto_nombre}</TableCell>
                            <TableCell>{p.producto_codigo}</TableCell>
                            <TableCell align="right">{p.cantidad_por_kit}</TableCell>
                            <TableCell align="right">{p.cantidad_total}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell colSpan={3}><strong>Total</strong></TableCell>
                          <TableCell align="right"><strong>{detalleSalida.productos.reduce((sum, p) => sum + p.cantidad_total, 0)}</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Producto:</strong> {detalleSalida.producto_nombre}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Cantidad:</strong> {detalleSalida.cantidad} unidades
                  </Typography>
                  <Typography variant="body1">
                    <strong>Stock restante:</strong> {detalleSalida.stock_restante}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalleModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      
      {/* 🆕 Modal de Edición de Salida */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Editar Salida
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setEditModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editandoSalida && (
            <>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {editandoSalida.tipo === 'kit' ? `Kit: ${editandoSalida.nombre}` : `Producto: ${editandoSalida.producto_nombre}`}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Motivo"
                    value={editFormData.motivo}
                    onChange={(e) => setEditFormData({ ...editFormData, motivo: e.target.value })}
                  >
                    {motivos.map((m) => (
                      <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={editandoSalida.tipo === 'kit' ? "Beneficiario" : "Cliente/Destino"}
                    value={editFormData.cliente}
                    onChange={(e) => setEditFormData({ ...editFormData, cliente: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label={editandoSalida.tipo === 'kit' ? "Cantidad de Kits" : "Cantidad"}
                    value={editCantidad}
                    onChange={(e) => setEditCantidad(parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                
                {editandoSalida.tipo === 'kit' && editProductosKit.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Productos del Kit:</Typography>
                    {editProductosKit.map((producto, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="medium">{producto.producto_nombre}</Typography>
                          <Typography variant="caption" color="text.secondary">{producto.producto_codigo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="number"
                            size="small"
                            value={producto.cantidad_por_kit}
                            onChange={(e) => handleEditUpdateCantidadKit(idx, e.target.value)}
                            sx={{ width: 80 }}
                            inputProps={{ min: 1 }}
                          />
                          <Typography variant="body2">unid/kit</Typography>
                          <IconButton size="small" color="error" onClick={() => handleEditRemoveProductoKit(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                )}
                {/* 🆕 SECCIÓN PARA AGREGAR PRODUCTOS */}
<Grid item xs={12}>
  <Divider sx={{ my: 2 }} />
  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <AddIcon /> Agregar otro producto
  </Typography>

  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
    <TextField
      size="small"
      fullWidth
      placeholder="Buscar producto por código o nombre..."
      value={editSearchTerm}
      onChange={(e) => setEditSearchTerm(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleEditSearch()}
    />
    <Button variant="outlined" onClick={handleEditSearch}>
      Buscar
    </Button>
  </Box>

  {editShowSearchResults && editSearchResults.length > 0 && (
    <Paper sx={{ mb: 2, maxHeight: 200, overflow: 'auto' }}>
      {editSearchResults.map((producto) => (
        <ListItem
          key={producto.id}
          button
          onClick={() => handleAgregarProductoAEdicion(producto)}
          sx={{ '&:hover': { bgcolor: 'action.hover' } }}
        >
          <ListItemText
            primary={producto.nombre}
            secondary={`${producto.codigo} • Stock: ${producto.stock_actual}`}
          />
        </ListItem>
      ))}
    </Paper>
  )}

  {editShowSearchResults && editSearchResults.length === 0 && editSearchTerm && (
    <Alert severity="info" sx={{ mb: 2 }}>
      No se encontró "{editSearchTerm}"
    </Alert>
  )}
</Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Notas"
                    value={editFormData.notas}
                    onChange={(e) => setEditFormData({ ...editFormData, notas: e.target.value })}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarEdicion} startIcon={<SaveIcon />}>
            Guardar Cambios
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
    </Container>
  )
}

export default SalidaView