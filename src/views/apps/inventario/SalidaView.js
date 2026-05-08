//src/views/apps/inventario/SalidaView.js

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
  Select,
  Checkbox  
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
import { useAuth } from 'src/hooks/useAuth'



const SalidaView = () => {

  const { user } = useAuth()
  const isSuperAdmin = user?.rol === 'super_admin'
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [productosKit, setProductosKit] = useState([])
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([])
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('')
  const [stockEnUbicacion, setStockEnUbicacion] = useState(0)
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
  const [showUbicacionSelector, setShowUbicacionSelector] = useState(false)
  const [productoParaSeleccion, setProductoParaSeleccion] = useState(null)
  const [mercadoCargado, setMercadoCargado] = useState(null)
  const [mercadoSeleccionado, setMercadoSeleccionado] = useState('')
  const [selectedSalidas, setSelectedSalidas] = useState([])
  const [confirmarMultipleOpen, setConfirmarMultipleOpen] = useState(false)
  const [numeroCajas, setNumeroCajas] = useState('')
  const [confirmacionEnProceso, setConfirmacionEnProceso] = useState(false)
  const [salidasParaPDF, setSalidasParaPDF] = useState([])
  const [cajasPorSalida, setCajasPorSalida] = useState({})
  

  // Generar número de remisión secuencial
const generarRMSecuencial = () => {
  const hoy = new Date()
  const año = hoy.getFullYear()
  const mes = (hoy.getMonth() + 1).toString().padStart(2, '0')
  
  // Obtener el último consecutivo del localStorage
  let consecutivo = localStorage.getItem('ultimoRMConsecutivo')
  if (!consecutivo) {
    consecutivo = '1'
  }
  
  const nuevoConsecutivo = parseInt(consecutivo) + 1
  localStorage.setItem('ultimoRMConsecutivo', nuevoConsecutivo.toString())
  
  return `RM-${año}${mes}-${nuevoConsecutivo.toString().padStart(5, '0')}`
}
  
  // Formulario
  const [formData, setFormData] = useState({
  motivo: 'Entrega de Ayudas',
  cantidad: 1,
  cliente: '',
  kitNombre: '',
  cantidadKits: 1,
  notas: '',
<<<<<<< HEAD
  fecha: new Date().toISOString().slice(0, 16),
  remision: '',  // ← AGREGAR
  caso: '',
  mercadoSeleccionado: ''  // ← AGREGAR
=======
  referencia: '',  // ✅ AGREGAR ESTA LÍNEA
  fecha: new Date().toISOString().slice(0, 16)
>>>>>>> 57cc1208e7e45d1c03831d942ae82ebef1193388
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
    'Entrega de Ayudas',           // Modo KIT (con cantidad de kits)
<<<<<<< HEAD
    'Entrega de Ayudas/Unidades',
    'Mercado Predefinido',  
=======
    'Entrega de Ayudas/Unidades',  // Modo MULTIPRODUCTO
    'Mercado Básico',              // NUEVO - Mercado predefinido básico
    'Mercado Grande',              // NUEVO - Mercado predefinido grande
>>>>>>> 57cc1208e7e45d1c03831d942ae82ebef1193388
    'Consumo Interno',
    'Dañado',
    'Caducado',
    'Ajuste de Inventario',
    'Transferencia',
    'Otro'
  ]
 

const cargarUbicacionesProducto = async (productoId) => {
  try {
    const sessionId = getSessionId()
    console.log(`🔵 Cargando ubicaciones para producto: ${productoId}`)
    
    const url = `http://localhost:8000/api/productos/${productoId}/stock-por-ubicacion?session_id=${sessionId}&_=${Date.now()}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`Error ${response.status}: ${response.statusText}`)
      setUbicacionesDisponibles([])
      return []
    }
    
     const data = await response.json()
    console.log(`📍 Respuesta del backend:`, data)

    // Obtener el array de ubicaciones
    const ubicacionesArray = data.stock_por_ubicacion || []
    
    // ✅ Filtrar solo ubicaciones con stock DISPONIBLE > 0
    const ubicacionesConStock = ubicacionesArray.filter(ub => ub.stock_disponible > 0)
    
    // ✅ Mostrar stock_disponible al usuario (no stock_fisico)
    const ubicacionesFormateadas = ubicacionesConStock.map(ub => ({
      ...ub,
      label: `${ub.ubicacion} (Disponible: ${ub.stock_disponible})`,
      stock_mostrar: ub.stock_disponible
    }))

    console.log(`📍 Ubicaciones con stock:`, ubicacionesConStock)
    setUbicacionesDisponibles(ubicacionesConStock)
    
    return ubicacionesConStock
  } catch (error) {
    console.error('Error cargando ubicaciones:', error)
    setUbicacionesDisponibles([])
    return []
  }
}
  const generarIdUnico = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
  const isModoKit = formData.motivo === 'Entrega de Ayudas'                    
  const isModoAyudasUnidades = formData.motivo === 'Entrega de Ayudas/Unidades' 
<<<<<<< HEAD
  const isModoMercadoPredefinido = formData.motivo === 'Mercado Predefinido'    
  const isModoNormal = !isModoKit && !isModoAyudasUnidades && !isModoMercadoPredefinido
  
  console.log('🎯 MODO ACTUAL:', {
  motivo: formData.motivo,
  isModoKit,
  isModoAyudasUnidades,
  isModoMercadoPredefinido,
  isModoNormal
})
=======
  const isModoNormal = !isModoKit && !isModoAyudasUnidades                     
  const isModoMercadoBasico = formData.motivo === 'Mercado Básico'
  const isModoMercadoGrande = formData.motivo === 'Mercado Grande'
  const isModoMercado = isModoMercadoBasico || isModoMercadoGrande

>>>>>>> 57cc1208e7e45d1c03831d942ae82ebef1193388

  // Cargar historial al iniciar
  useEffect(() => {
    cargarUltimasSalidas()
    cargarReservaPendiente()
  }, [])
  
<<<<<<< HEAD
  useEffect(() => {
  // Generar nuevo RM solo si no hay uno existente o si cambió el motivo
  if (!formData.remision) {
    setFormData(prev => ({ ...prev, remision: generarRMSecuencial() }))
  }
}, [formData.motivo]) // Se ejecuta cuando cambia el motivo

// También generar RM cuando se limpia el formulario
useEffect(() => {
  if (!formData.remision && formData.motivo) {
    setFormData(prev => ({ ...prev, remision: generarRMSecuencial() }))
  }
}, [formData.motivo, formData.kitNombre, formData.mercadoSeleccionado])
=======
  // Función para crear salida de mercado predefinido
const handleCrearSalidaMercado = async () => {
  if (!formData.cliente.trim()) {
    setSnackbar({ open: true, message: '❌ Ingresa el nombre del beneficiario', severity: 'error' })
    return
  }
  
  setLoading(true)
  try {
    const mercadoNombre = isModoMercadoBasico ? 'MERCADO_BASICO' : 'MERCADO_GRANDE'
    const cantidadKits = formData.cantidadKits || 1
    
    const response = await fetch('http://localhost:8000/api/movimientos/salida-por-mercado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mercado_nombre: mercadoNombre,
        cantidad: cantidadKits,
        cliente: formData.cliente,
        notas: formData.notas,
        referencia: formData.referencia || ''
      })
    })
    
    if (response.ok) {
      // Descargar el PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Obtener el número de remisión del header
      const remision = response.headers.get('X-Remision') || 'desconocido'
      link.download = `comprobante_mercado_${remision}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setSnackbar({ 
        open: true, 
        message: `✅ ${cantidadKits} kit(s) de ${isModoMercadoBasico ? 'Mercado Básico' : 'Mercado Grande'} registrado(s). Remisión: ${remision}`, 
        severity: 'success' 
      })
      
      handleClearForm()
      cargarUltimasSalidas()
      
    } else {
      const errorData = await response.json()
      let mensaje = `❌ Error: ${errorData.error || 'Error desconocido'}`
      if (errorData.detalles) {
        mensaje += '\n\n' + errorData.detalles.map(d => `• ${d.producto_nombre}: necesita ${d.necesario}, disponible: ${d.disponible}`).join('\n')
        alert(mensaje)
      } else {
        setSnackbar({ open: true, message: mensaje, severity: 'error' })
      }
    }
  } catch (error) {
    console.error('Error:', error)
    setSnackbar({ open: true, message: 'Error al registrar salida del mercado', severity: 'error' })
  } finally {
    setLoading(false)
  }
}

>>>>>>> 57cc1208e7e45d1c03831d942ae82ebef1193388

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
      
      const itemsPendientes = itemsConStockActualizado.map((item, idx) => ({
        id: item.id || `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        tipo: item.tipo || 'normal',
        nombre: item.nombre,
        productos: item.tipo === 'kit' || item.tipo === 'multiple' 
          ? (item.productos || [{
              producto_id: item.producto_id,
              producto_nombre: item.producto_nombre,
              producto_codigo: item.producto_codigo,
              ubicacion: item.ubicacion,  // ← AGREGAR UBICACIÓN
              cantidad: item.cantidad,
              cantidad_total: item.cantidad_total || item.cantidad
            }])
          : null,
        producto_id: item.producto_id,
        producto_nombre: item.producto_nombre,
        producto_codigo: item.producto_codigo,
        ubicacion: item.ubicacion,  // ← AGREGAR UBICACIÓN
        cantidad: item.cantidad,
        cantidad_kits: item.cantidad_kits,
        motivo: item.motivo || 'Entrega de Ayudas',
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
    console.log('📦 Últimas salidas recibidas:', salidas.length)
    setUltimasSalidas(salidas)
      
      const pdfInfoPromises = salidas.map(async (mov) => {
        try {
          if (!mov.id) return { id: mov.id, info: { tiene_pdf: false } }
          const info = await salidasService.getPDFInfo(mov.id)
          return { id: mov.id, info }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Error obteniendo PDF info:', error)
          }
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
  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    try {
      const results = await salidasService.buscarProducto(searchTerm)
      
      const resultsConStockDisponible = await Promise.all(
        results.map(async (producto) => {
          try {
            const stockInfo = await reservasService.getStockDisponible(producto.codigo)
            return {
              ...producto,
              stock_actual: stockInfo.stock_disponible,
              stock_fisico: stockInfo.stock_fisico,
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

  
const handleSelectProduct = async (producto) => {
  // Modo kit o ayudas/unidades -> agregar a lista
  if (isModoKit || isModoAyudasUnidades) {
    // Cargar ubicaciones disponibles para mostrar
    const ubicaciones = await cargarUbicacionesProducto(producto.codigo, true)
    
    if (!ubicaciones || ubicaciones.length === 0) {
      setSnackbar({ 
        open: true, 
        message: `⚠️ El producto ${producto.nombre} no tiene stock en ninguna ubicación.`, 
        severity: 'warning' 
      })
      return
    }
    
    // Si hay múltiples ubicaciones, mostrar selector
    if (ubicaciones.length > 1) {
      // Crear un dialog o prompt con las opciones
      const opciones = ubicaciones.map((ub, idx) => 
        `${idx + 1}. ${ub.ubicacion} (${ub.stock_disponible} disponibles)`
      ).join('\n')
      
      const seleccion = prompt(
        `Selecciona ubicación para ${producto.nombre}:\n\n${opciones}\n\nIngresa el número de la ubicación:`
      )
      
      if (!seleccion) return
      
      const idxSeleccionado = parseInt(seleccion) - 1
      if (isNaN(idxSeleccionado) || idxSeleccionado < 0 || idxSeleccionado >= ubicaciones.length) {
        setSnackbar({ open: true, message: 'Selección no válida', severity: 'error' })
        return
      }
      
      const ubicacionSel = ubicaciones[idxSeleccionado]
      setUbicacionSeleccionada(ubicacionSel.ubicacion)
      setStockEnUbicacion(ubicacionSel.stock_disponible)
      
      // Agregar a la lista con la ubicación seleccionada
      const existente = productosKit.find(p => p.id === producto.id && p.ubicacion === ubicacionSel.ubicacion)
      
      if (existente) {
        setProductosKit(prev =>
          prev.map(p =>
            p.id === producto.id && p.ubicacion === ubicacionSel.ubicacion 
              ? { ...p, cantidad_por_kit: p.cantidad_por_kit + 1 } 
              : p
          )
        )
        setSnackbar({ open: true, message: `${producto.nombre}: +1 unidad en ${ubicacionSel.ubicacion}`, severity: 'success' })
      } else {
        setProductosKit(prev => [
          ...prev,
          {
            ...producto,
            ubicacion: ubicacionSel.ubicacion,
            stock_en_ubicacion: ubicacionSel.stock_disponible,
            cantidad_por_kit: 1
          }
        ])
        setSnackbar({ open: true, message: `${producto.nombre} agregado (${ubicacionSel.ubicacion})`, severity: 'success' })
      }
    } else {
      // Solo una ubicación, seleccionar automáticamente
      const ubicacionUnica = ubicaciones[0]
      setUbicacionSeleccionada(ubicacionUnica.ubicacion)
      setStockEnUbicacion(ubicacionUnica.stock_disponible)
      
      const existente = productosKit.find(p => p.id === producto.id && p.ubicacion === ubicacionUnica.ubicacion)
      
      if (existente) {
        setProductosKit(prev =>
          prev.map(p =>
            p.id === producto.id && p.ubicacion === ubicacionUnica.ubicacion 
              ? { ...p, cantidad_por_kit: p.cantidad_por_kit + 1 } 
              : p
          )
        )
        setSnackbar({ open: true, message: `${producto.nombre}: +1 unidad en ${ubicacionUnica.ubicacion}`, severity: 'success' })
      } else {
        setProductosKit(prev => [
          ...prev,
          {
            ...producto,
            ubicacion: ubicacionUnica.ubicacion,
            stock_en_ubicacion: ubicacionUnica.stock_disponible,
            cantidad_por_kit: 1
          }
        ])
        setSnackbar({ open: true, message: `${producto.nombre} agregado (${ubicacionUnica.ubicacion})`, severity: 'success' })
      }
    }
    
    setSearchTerm('')
    setShowSearchResults(false)
  } else {
    // Modo normal (un solo producto)
    const ubicaciones = await cargarUbicacionesProducto(producto.codigo)
    
    if (!ubicaciones || ubicaciones.length === 0) {
      setSnackbar({ 
        open: true, 
        message: `⚠️ El producto ${producto.nombre} no tiene stock en ninguna ubicación.`, 
        severity: 'warning' 
      })
      return
    }
    
    const ubicacionesArray = Array.isArray(ubicaciones) ? ubicaciones : []

    // Guardar ubicaciones en estado para el selector
    setUbicacionesDisponibles(ubicaciones)
    
    // Mostrar selector de ubicación en un Dialog
    setProductoSeleccionado(producto)
    setShowUbicacionSelector(true)  // Nuevo estado para mostrar modal
    setFormData(prev => ({ ...prev, cantidad: 1 }))
    
    setSearchTerm('')
    setShowSearchResults(false)
  }
}

  const handleUpdateCantidadKit = (index, nuevaCantidad) => {
    if (nuevaCantidad === '') {
      setProductosKit(prev =>
        prev.map((p, i) => i === index ? { ...p, cantidad_por_kit: '' } : p)
      )
      return
    }
    
    const cantidad = parseInt(nuevaCantidad, 10)
    if (!isNaN(cantidad) && cantidad > 0) {
    const producto = productosKit[index]
    const cantidadKits = isModoKit ? (formData.cantidadKits || 1) : 1
    const cantidadTotal = cantidad * cantidadKits
    const stockEnUbicacion = producto.stock_en_ubicacion || 0
      
      if (cantidadTotal > producto.stock_actual) {
        setSnackbar({ 
        open: true, 
        message: `⚠️ Stock insuficiente en ${producto.ubicacion || 'la ubicación'}. Disponible: ${stockEnUbicacion}, Necesita: ${cantidadTotal}`, 
        severity: 'error' 
      })
      return
      }
      
      setProductosKit(prev =>
        prev.map((p, i) => i === index ? { ...p, cantidad_por_kit: cantidad } : p)
      )
    }
  }

  const handleRemoveProductoKit = (index) => {
    const producto = productosKit[index]
    setProductosKit(prev => prev.filter((_, i) => i !== index))
    setSnackbar({ open: true, message: `${producto.nombre} eliminado`, severity: 'info' })
  }

  const handleClearKit = () => {
    if (productosKit.length > 0) {
      setProductosKit([])
      setSnackbar({ open: true, message: isModoKit ? 'Kit limpiado' : 'Lista limpiada', severity: 'info' })
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
<<<<<<< HEAD
    fecha: new Date().toISOString().slice(0, 16),
    remision: generarRMSecuencial(),  // ← Generar RM aquí
    caso: '',
    mercadoSeleccionado: ''
=======
    referencia: '',  // ✅ AGREGAR ESTA LÍNEA
    fecha: new Date().toISOString().slice(0, 16)
>>>>>>> 57cc1208e7e45d1c03831d942ae82ebef1193388
  })
  setSearchTerm('')
  setShowSearchResults(false)
}

  const verificarStock = () => {
  if (!productoSeleccionado) return { valido: true, mensaje: '', advertencia: null }
  
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
  
  return { valido: true, mensaje: '', advertencia: null }
}
const stockCheck = verificarStock()

  const verificarStockKit = () => {
    const cantidadKits = isModoKit ? formData.cantidadKits : 1
    const errores = []
    
    productosKit.forEach(producto => {
      const totalNecesario = producto.cantidad_por_kit * cantidadKits
      const stockDisponibleEnUbicacion = producto.stock_en_ubicacion || 0
      if (totalNecesario > stockDisponibleEnUbicacion) {
      errores.push({
        nombre: producto.nombre,
        ubicacion: producto.ubicacion || 'Sin ubicación',
        necesario: totalNecesario,
        disponible: stockDisponibleEnUbicacion,
        porKit: producto.cantidad_por_kit
      })
    }
  })
    
    return { errores, valido: errores.length === 0 }
  }

  const hayErroresStock = () => {
  console.log('🔍 hayErroresStock - inicio:', { 
    isModoMercadoPredefinido, 
    tieneMercadoCargado: !!mercadoCargado,
    cantidadKits: formData.cantidadKits 
  })
  
  if (isModoMercadoPredefinido && mercadoCargado && formData.cantidadKits > 0) {
    for (const producto of mercadoCargado.productos) {
      const totalNecesario = producto.cantidad * formData.cantidadKits
      const stockDisponible = producto.stock_disponible || 0
      console.log(`   ${producto.producto_nombre}: necesita ${totalNecesario}, disponible: ${stockDisponible}`)
      if (totalNecesario > stockDisponible) {
        console.log('   ❌ Retornando TRUE - stock insuficiente')
        return true
      }
    }
    console.log('   ✅ Retornando FALSE - stock suficiente')
    return false
  }
  console.log('   ⏭️ No aplica para mercado, retornando false')
  return false
}

  const handleUpdateCantidadKits = (nuevaCantidad) => {
    const numValue = parseInt(nuevaCantidad, 10)
    if (!isNaN(numValue) && numValue > 0) {
      // Validar stock con la nueva cantidad de kits
      const erroresStock = []
    productosKit.forEach(producto => {
      const cantidadTotal = producto.cantidad_por_kit * numValue
      const stockEnUbicacion = producto.stock_en_ubicacion || 0
      if (cantidadTotal > stockEnUbicacion) {
        erroresStock.push({
          nombre: producto.nombre,
          ubicacion: producto.ubicacion,
          cantidadTotal: cantidadTotal,
          stockActual: stockEnUbicacion
        })
      }
    })
      
      if (erroresStock.length > 0) {
        let mensaje = '⚠️ Stock insuficiente para la cantidad de kits seleccionada:\n'
        erroresStock.forEach(e => {
          mensaje += `• ${e.nombre}: necesita ${e.cantidadTotal}, disponible: ${e.stockActual}\n`
        })
        setSnackbar({ open: true, message: mensaje, severity: 'error' })
      } else {
        setFormData(prev => ({ ...prev, cantidadKits: numValue }))
      }
    }
  }
const cargarMercadoPredefinido = async (nombreMercado) => {
  try {
    const response = await fetch(`http://localhost:8000/api/movimientos/mercados/${nombreMercado}`)
    if (!response.ok) throw new Error('Error cargando mercado')
    const data = await response.json()
    
    // Para cada producto, obtener stock disponible
    const productosConStock = await Promise.all(
      data.productos.map(async (p) => {
        const stockInfo = await reservasService.getStockDisponible(p.producto_id)
        return {
          ...p,
          stock_disponible: stockInfo.stock_disponible || 0
        }
      })
    )
    
    setMercadoCargado({ ...data, productos: productosConStock })
    return { ...data, productos: productosConStock }
  } catch (error) {
    console.error('Error cargando mercado:', error)
    setSnackbar({ open: true, message: 'Error cargando mercado predefinido', severity: 'error' })
    return null
  }
}
  // Agregar a lista de pendientes
  const handleAgregarALista = async () => {
    // MODO KIT (Entrega de Ayudas con cantidad de kits)
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
  let mensaje = 'Stock insuficiente en la(s) ubicación(es) seleccionada(s):\n\n'
  stockCheck.errores.forEach(e => {
    mensaje += `• ${e.nombre} (${e.ubicacion}): Necesario ${e.porKit} × ${formData.cantidadKits} kits = ${e.necesario} unidades, Disponible: ${e.disponible}\n`
  })
  alert(mensaje)
  return
}
      
      const kit = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,  
        tipo: 'kit',
        nombre: formData.kitNombre,
        cantidad_kits: formData.cantidadKits,
        motivo: formData.motivo,
        cliente: formData.cliente,
        notas: formData.notas,
        fecha: formData.fecha,
        remision: formData.remision || generarRMSecuencial(),
        caso: formData.caso,
        productos: productosKit.map(p => ({
          id: p.id,
          producto_id: p.codigo,
          producto_nombre: p.nombre,
          producto_codigo: p.codigo,
          ubicacion: p.ubicacion,
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
        ubicacion: p.ubicacion,
        cantidad: p.cantidad_total,
        stock_actual: p.stock_actual,
        stock_minimo: p.stock_minimo || 5,
        tipo: 'kit',
        nombre: kit.nombre,
        cantidad_kits: kit.cantidad_kits,
        remision: kit.remision,
        caso: kit.caso,
        cajas: kit.cajas
      }))
      
      try {
        await reservasService.guardarReserva(itemsParaReserva, {
          tipo: 'kit',
          kitNombre: kit.nombre,
          cliente: kit.cliente,
          notas: kit.notas,
          fecha: kit.fecha,
          caso: kit.caso
        })
         const productosActualizados = productosKit.map(p => {
      const itemReservado = itemsParaReserva.find(ir => 
        ir.producto_id === p.codigo && ir.ubicacion === p.ubicacion
      )
      if (itemReservado) {
        return {
          ...p,
          stock_en_ubicacion: (p.stock_en_ubicacion || p.stock_actual) - itemReservado.cantidad
        }
      }
      return p
    })
    setProductosKit(productosActualizados)
    
    reservasService.clearCache()
    setSnackbar({ open: true, message: `✅ Kit "${formData.kitNombre}" agregado y stock reservado`, severity: 'success' })
  } catch (error) {
        setSnackbar({ open: true, message: `❌ Error reservando stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
        return
      }
      
      handleClearForm()
    }
    // MODO MULTIPRODUCTO (Entrega de Ayudas/Unidades)
    else if (isModoAyudasUnidades) {
      if (productosKit.length === 0) {
        setSnackbar({ open: true, message: '❌ Selecciona al menos un producto', severity: 'error' })
        return
      }
      
      if (!formData.cliente.trim()) {
        setSnackbar({ open: true, message: '❌ Ingresa el nombre del beneficiario', severity: 'error' })
        return
      }
      
      // Verificar stock para cada producto
      const erroresStock = []
      productosKit.forEach(producto => {
        if (producto.cantidad_por_kit > producto.stock_actual) {
          erroresStock.push({
            nombre: producto.nombre,
            necesario: producto.cantidad_por_kit,
            disponible: producto.stock_actual
          })
        }
      })
      
      if (erroresStock.length > 0) {
        let mensaje = 'Stock insuficiente:\n\n'
        erroresStock.forEach(e => {
          mensaje += `• ${e.nombre}: necesita ${e.necesario}, disponible: ${e.disponible}\n`
        })
        alert(mensaje)
        return
      }
      
      const salidaMultiple = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
        tipo: 'multiple',
        nombre: `Salida múltiple (${productosKit.length} productos)`,
        motivo: formData.motivo,
        cliente: formData.cliente,
        notas: formData.notas,
        fecha: formData.fecha,
        remision: formData.remision || generarRMSecuencial(),
        productos: productosKit.map(p => ({
          id: p.id,
          producto_id: p.codigo,
          producto_nombre: p.nombre,
          producto_codigo: p.codigo,
          ubicacion: p.ubicacion,
          cantidad: p.cantidad_por_kit,
          stock_disponible: p.stock_actual
        }))
      }
      
      setSalidasPendientes(prev => [...prev, salidaMultiple])
      
      const itemsParaReserva = salidaMultiple.productos.map(p => ({
        producto_id: p.producto_id,
        producto_nombre: p.producto_nombre,
        producto_codigo: p.producto_codigo,
        ubicacion: p.ubicacion,
        cantidad: p.cantidad,
        stock_actual: p.stock_disponible,
        tipo: 'multiple',
        remision: salidaMultiple.remision,  // ← AGREGAR
        caso: salidaMultiple.caso, 
      }))
      
      try {
        await reservasService.guardarReserva(itemsParaReserva, {
          tipo: 'multiple',
          cliente: salidaMultiple.cliente,
          notas: salidaMultiple.notas,
          fecha: salidaMultiple.fecha
        })
        const productosActualizados = productosKit.map(p => {
      const itemReservado = itemsParaReserva.find(ir => 
        ir.producto_id === p.codigo && ir.ubicacion === p.ubicacion
      )
      if (itemReservado) {
        return {
          ...p,
          stock_en_ubicacion: (p.stock_en_ubicacion || p.stock_actual) - itemReservado.cantidad
        }
      }
      return p
    })
    setProductosKit(productosActualizados)
    
    setSnackbar({ open: true, message: `✅ ${productosKit.length} productos agregados`, severity: 'success' })
  } catch (error) {
        setSnackbar({ open: true, message: `❌ Error reservando stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
        return
      }
      
      handleClearForm()
    }
   else if (isModoMercadoPredefinido) {
  console.log('🟢 Procesando Mercado Predefinido')
  
  if (!mercadoSeleccionado) {  // ← Usar mercadoSeleccionado
    setSnackbar({ open: true, message: '❌ Selecciona un mercado', severity: 'error' })
    return
  }
  
  if (!formData.cliente.trim()) {
    setSnackbar({ open: true, message: '❌ Ingresa el nombre del beneficiario', severity: 'error' })
    return
  }
  
  if (!mercadoCargado) {
    setSnackbar({ open: true, message: '❌ Cargando mercado, intenta de nuevo', severity: 'error' })
    return
  }
  
  // Validar stock
  const errores = []
  for (const producto of mercadoCargado.productos) {
    const totalNecesario = producto.cantidad * formData.cantidadKits
    if (totalNecesario > (producto.stock_disponible || 0)) {
      errores.push(`${producto.producto_nombre}: necesita ${totalNecesario}, disponible: ${producto.stock_disponible}`)
    }
  }
  
  if (errores.length > 0) {
    setSnackbar({ open: true, message: `Stock insuficiente: ${errores.join(', ')}`, severity: 'error' })
    return
  }
  
  // Obtener ubicaciones para cada producto
  const productosConUbicacion = []
  for (const prod of mercadoCargado.productos) {
    const ubicaciones = await cargarUbicacionesProducto(prod.producto_id)
    if (ubicaciones.length === 0) {
      setSnackbar({ open: true, message: `❌ ${prod.producto_nombre} no tiene ubicación disponible`, severity: 'error' })
      return
    }
    productosConUbicacion.push({
      producto_id: prod.producto_id,
      producto_nombre: prod.producto_nombre,
      cantidad_por_kit: prod.cantidad,
      cantidad_total: prod.cantidad * formData.cantidadKits,
      ubicacion: ubicaciones[0].ubicacion,
      stock_en_ubicacion: ubicaciones[0].stock_disponible
    })
  }
  
  const salidaMercado = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tipo: 'kit',
    nombre: formData.mercadoSeleccionado,
    cantidad_kits: formData.cantidadKits,
    motivo: formData.motivo,
    cliente: formData.cliente,
    notas: formData.notas,
    fecha: formData.fecha,
    remision: formData.remision || generarRMSecuencial(),
    caso: formData.caso,
    productos: productosConUbicacion
  }
  
  setSalidasPendientes(prev => [...prev, salidaMercado])
  
  const itemsParaReserva = productosConUbicacion.map(p => ({
    producto_id: p.producto_id,
    producto_nombre: p.producto_nombre,
    producto_codigo: p.producto_id,
    ubicacion: p.ubicacion,
    cantidad: p.cantidad_total,
    stock_actual: p.stock_en_ubicacion,
    stock_minimo: 5,
    tipo: 'kit',
    nombre: formData.mercadoSeleccionado,
    cantidad_kits: formData.cantidadKits,
    remision: '',
    caso: formData.caso
  }))
  
  try {
    await reservasService.guardarReserva(itemsParaReserva, {
      tipo: 'kit',
      kitNombre: formData.mercadoSeleccionado,
      cliente: formData.cliente,
      notas: formData.notas,
      fecha: formData.fecha,
      caso: formData.caso
    })
    reservasService.clearCache()
    setSnackbar({ open: true, message: `✅ ${formData.cantidadKits} mercado(s) agregado(s)`, severity: 'success' })
  } catch (error) {
    setSnackbar({ open: true, message: `❌ Error reservando stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
    return
  }
  
  handleClearForm()
}
    // MODO NORMAL (un solo producto)
    else {
      if (!productoSeleccionado) {
        setSnackbar({ open: true, message: '❌ Selecciona un producto primero', severity: 'error' })
        return
      }
      
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
       id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       tipo: 'normal',
       producto: productoSeleccionado,
  producto_id: productoSeleccionado.codigo,
  ubicacion: productoSeleccionado.ubicacion,  // Incluir ubicación
  cantidad: formData.cantidad,
  motivo: formData.motivo,
  cliente: formData.cliente,
  notas: formData.notas,
  fecha: formData.fecha,
  remision: formData.remision || generarRMSecuencial(),
  stock_restante: productoSeleccionado.stock_en_ubicacion - formData.cantidad,
  producto_nombre: productoSeleccionado.nombre,
  producto_codigo: productoSeleccionado.codigo,
  stock_actual: productoSeleccionado.stock_actual,
  stock_minimo: productoSeleccionado.stock_minimo
}

// Los itemsParaReserva también deben incluir ubicación
const itemsParaReserva = [{
  producto_id: salida.producto_id,
  producto_nombre: salida.producto_nombre,
  producto_codigo: salida.producto_codigo,
  ubicacion: salida.ubicacion,  // Incluir ubicación
  cantidad: salida.cantidad,
  stock_actual: salida.stock_actual,
  stock_minimo: salida.stock_minimo,
  remision: salida.remision,  // ← AGREGAR
  caso: salida.caso,
  tipo: 'normal'
}]
      
      try {
        await reservasService.guardarReserva(itemsParaReserva, {
          tipo: 'normal',
          cliente: salida.cliente,
          notas: salida.notas,
          fecha: salida.fecha
        })
        setProductoSeleccionado(prev => ({
      ...prev,
      stock_actual: prev.stock_actual - formData.cantidad,
      stock_en_ubicacion: (prev.stock_en_ubicacion || prev.stock_actual) - formData.cantidad
    }))
    
    setSnackbar({ open: true, message: `✅ ${formData.cantidad} unidades reservadas de "${productoSeleccionado.nombre}"`, severity: 'success' })
  } catch (error) {
        setSnackbar({ open: true, message: `❌ Error reservando stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
        return
      }
      
      handleClearForm()
    }
  }
  const handleToggleSelect = (id) => {
  setSelectedSalidas(prev => 
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  )
}

const handleSelectAll = () => {
  if (selectedSalidas.length === salidasPendientes.length) {
    setSelectedSalidas([])
  } else {
    setSelectedSalidas(salidasPendientes.map(s => s.id))
  }
}

const handleConfirmarMultiples = async () => {
  if (selectedSalidas.length === 0) {
    setSnackbar({ open: true, message: '❌ Selecciona al menos una salida', severity: 'error' })
    return
  }
  
  console.log('📋 selectedSalidas IDs:', selectedSalidas)
  console.log('📋 salidasPendientes:', salidasPendientes.map(s => ({ id: s.id, tipo: s.tipo, nombre: s.nombre || s.producto_nombre })))
  
  // Preguntar cajas para cada salida seleccionada
  const salidasConCajas = []
  for (let i = 0; i < selectedSalidas.length; i++) {
    const id = selectedSalidas[i]
    const salida = salidasPendientes.find(s => s.id === id)
    
    // ✅ Validar que la salida existe
    if (!salida) {
      console.error(`❌ Salida con id ${id} no encontrada`)
      setSnackbar({ open: true, message: `❌ Error: Salida no encontrada. Recarga la página.`, severity: 'error' })
      return
    }
    
    const nombreSalida = salida.tipo === 'kit' ? salida.nombre : (salida.producto_nombre || 'Salida')
    
    const input = window.prompt(`Ingrese el número de cajas para: ${nombreSalida}`)
    const num = parseInt(input)
    if (isNaN(num) || num <= 0) {
      setSnackbar({ open: true, message: 'Número de cajas inválido. Proceso cancelado.', severity: 'warning' })
      return
    }
    
    salidasConCajas.push({ 
      ...salida, 
      cajas: num,
      remision: salida.remision || generarRMSecuencial(),
      caso: salida.caso || 'N/A'
    })
  }
  
  setLoading(true)
  try {
    // ✅ Confirmar la reserva completa
    const resultado = await reservasService.confirmarReserva()
    
    if (resultado.success) {
      // ✅ Eliminar las salidas confirmadas de la lista
      setSalidasPendientes(prev => prev.filter(s => !selectedSalidas.includes(s.id)))
      await cargarUltimasSalidas()
      reservasService.clearCache()
      
      // ✅ Generar comprobante
      await generarComprobanteMultiple(salidasConCajas)
      
      setSelectedSalidas([])
      setSnackbar({ open: true, message: `✅ ${salidasConCajas.length} salida(s) confirmada(s)`, severity: 'success' })
    } else {
      throw new Error(resultado.message || 'Error al confirmar')
    }
  } catch (error) {
    console.error('Error en handleConfirmarMultiples:', error)
    setSnackbar({ open: true, message: `❌ Error al confirmar: ${error.message}`, severity: 'error' })
  } finally {
    setLoading(false)
  }
}
 const handleConfirmarSalida = async (item, index, skipRemove = false) => {
  setLoading(true)
  
  try {
    const resultado = await reservasService.confirmarReserva()
    
    if (resultado.success) {
      // Actualizar stock local...
      if (item.tipo === 'kit') {
        setProductosKit(prev => 
          prev.map(p => {
            const productoAfectado = item.productos.find(ip => ip.producto_id === p.producto_id && ip.ubicacion === p.ubicacion)
            if (productoAfectado) {
              return {
                ...p,
                stock_en_ubicacion: (p.stock_en_ubicacion || p.stock_actual) - productoAfectado.cantidad_total,
                stock_actual: (p.stock_actual || 0) - productoAfectado.cantidad_total
              }
            }
            return p
          })
        )
      }
      
      if (!skipRemove) {
        setSalidasPendientes(prev => prev.filter((_, i) => i !== index))
        await cargarUltimasSalidas()
      }
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
  const confirmarUnaSalida = async (item, index, acumularParaPDF = true) => {
  // Preguntar número de cajas
  const cajas = await new Promise((resolve) => {
    const input = window.prompt(`Ingrese el número de cajas para ${item.tipo === 'kit' ? `el kit "${item.nombre}"` : `la salida de ${item.producto_nombre}`}:`)
    const num = parseInt(input)
    resolve(isNaN(num) || num <= 0 ? null : num)
  })
  
  if (!cajas) {
    setSnackbar({ open: true, message: 'Número de cajas inválido. Confirmación cancelada.', severity: 'warning' })
    return null
  }
  
  setLoading(true)
  try {
    const resultado = await reservasService.confirmarReserva()
    
    if (resultado.success) {
      // Actualizar stock local
      if (item.tipo === 'kit') {
        setProductosKit(prev => 
          prev.map(p => {
            const productoAfectado = item.productos.find(ip => ip.producto_id === p.producto_id && ip.ubicacion === p.ubicacion)
            if (productoAfectado) {
              return {
                ...p,
                stock_en_ubicacion: (p.stock_en_ubicacion || p.stock_actual) - productoAfectado.cantidad_total,
                stock_actual: (p.stock_actual || 0) - productoAfectado.cantidad_total
              }
            }
            return p
          })
        )
      } else {
        if (productoSeleccionado && productoSeleccionado.codigo === item.producto_id) {
          setProductoSeleccionado(prev => ({
            ...prev,
            stock_actual: (prev.stock_actual || 0) - item.cantidad,
            stock_en_ubicacion: (prev.stock_en_ubicacion || prev.stock_actual) - item.cantidad
          }))
        }
      }
      
      if (acumularParaPDF) {
        return { ...resultado, cajas, item }  // Retornar datos para el PDF múltiple
      } else {
        setSalidasPendientes(prev => prev.filter((_, i) => i !== index))
        await cargarUltimasSalidas()
        setSnackbar({ open: true, message: `✅ Salida confirmada con ${cajas} caja(s)`, severity: 'success' })
      }
      
      reservasService.clearCache()
      return resultado
    } else {
      throw new Error(resultado.message || 'Error al confirmar')
    }
    
  } catch (error) {
    setSnackbar({ 
      open: true, 
      message: `❌ Error al confirmar: ${error.response?.data?.detail || error.message}`, 
      severity: 'error' 
    })
    return null
  } finally {
    setLoading(false)
  }
}
  const handleEliminarPendiente = async (index) => {
  const item = salidasPendientes[index]
  

  console.log('🗑️ Eliminando item:', item)
  console.log('🗑️ Tipo:', item.tipo)
  console.log('🗑️ Productos:', item.productos)

  let mensajeConfirmacion = ''
  if (item.tipo === 'kit') {
    mensajeConfirmacion = `¿Eliminar el kit "${item.nombre}" con ${item.productos?.length} productos?`
  } else if (item.tipo === 'multiple') {
    mensajeConfirmacion = `¿Eliminar salida múltiple de ${item.productos?.length} productos?`
  } else {
    mensajeConfirmacion = `¿Eliminar salida de ${item.cantidad} unidades de "${item.producto_nombre}"?`
  }
  
  if (!window.confirm(mensajeConfirmacion)) return
  
  const ajustes = []
  
  if (item.tipo === 'kit') {
  console.log('🔍 Productos del kit:', JSON.stringify(item.productos, null, 2))
  for (const producto of item.productos) {
    console.log(`   producto_id: ${producto.producto_id}, ubicacion: ${producto.ubicacion}`)
    ajustes.push({
      producto_id: producto.producto_id,
      ubicacion: producto.ubicacion, 
      diferencia: -producto.cantidad_total,
      producto_nombre: producto.producto_nombre,
      producto_codigo: producto.producto_codigo
    })
  }
} else if (item.tipo === 'multiple') {
    for (const producto of item.productos) {
      ajustes.push({
        producto_id: producto.producto_id,
        ubicacion: producto.ubicacion,  // ← AGREGAR UBICACIÓN
        diferencia: -producto.cantidad,
        producto_nombre: producto.producto_nombre,
        producto_codigo: producto.producto_codigo
      })
    }
  } else {
    // Modo normal - un solo producto
    ajustes.push({
      producto_id: item.producto_id,
      ubicacion: item.ubicacion,  // ← AGREGAR UBICACIÓN
      diferencia: -item.cantidad,
      producto_nombre: item.producto_nombre,
      producto_codigo: item.producto_codigo
    })
  }
  
  console.log('📦 Ajustes a enviar:', ajustes)  // ← Debe mostrar ubicación
  
  try {
    await reservasService.ajustarReserva(ajustes, {
      tipo: 'eliminacion',
      motivo: 'Salida cancelada'
    })
    
    setSalidasPendientes(prev => prev.filter((_, i) => i !== index))
    
    const mensajes = ajustes.map(a => 
      `${a.producto_nombre} (${a.ubicacion}): ${Math.abs(a.diferencia)} unidades liberadas`
    )
    setSnackbar({ open: true, message: `✅ Stock liberado: ${mensajes.join(', ')}`, severity: 'success' })
    
    if (typeof cargarUltimasSalidas === 'function') {
      cargarUltimasSalidas()
    }
    
    reservasService.clearCache()
    
  } catch (error) {
    setSnackbar({ open: true, message: `Error al liberar stock: ${error.response?.data?.detail || error.message}`, severity: 'error' })
  }
}

  const handleEditarSalida = (item) => {
    setEditandoSalida(item)
    
    if (item.tipo === 'kit' || item.tipo === 'multiple') {
      setEditFormData({
        motivo: item.motivo,
        cliente: item.cliente,
        notas: item.notas || '',
        fecha: item.fecha
      })
      setEditProductosKit([...item.productos])
      setEditCantidad(item.tipo === 'kit' ? item.cantidad_kits : 1)
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

  const handleGuardarEdicion = async () => {
    if (!editandoSalida) return
    
    const updatedItem = { ...editandoSalida }
    const ajustes = []
    
    if (editandoSalida.tipo === 'kit') {
      updatedItem.motivo = editFormData.motivo
      updatedItem.cliente = editFormData.cliente
      updatedItem.notas = editFormData.notas
      updatedItem.fecha = editFormData.fecha
      updatedItem.cantidad_kits = editCantidad
      
      const productosOriginales = {}
  editandoSalida.productos.forEach(p => {
    const key = `${p.producto_id}|${p.ubicacion || 'SIN_UBICACION'}`
    productosOriginales[key] = p.cantidad_total
  })
      
      updatedItem.productos = editProductosKit.map(p => ({
        ...p,
        cantidad_total: p.cantidad_por_kit * editCantidad
      }))
      updatedItem.total_unidades = updatedItem.productos.reduce((sum, p) => sum + p.cantidad_total, 0)
      
      for (const producto of updatedItem.productos) {
        const key = `${producto.producto_id}|${producto.ubicacion || 'SIN_UBICACION'}`
        const cantidadOriginal = productosOriginales[key] || 0
        const cantidadNueva = producto.cantidad_total
        const diferencia = cantidadNueva - cantidadOriginal
        
        if (diferencia !== 0) {
          ajustes.push({
            producto_id: producto.producto_id,
            ubicacion: producto.ubicacion,
            diferencia: diferencia,
            producto_nombre: producto.producto_nombre,
            producto_codigo: producto.producto_codigo
          })
        }
      }
      
      for (const [key, cantidadOriginal] of Object.entries(productosOriginales)) {
       const existe = updatedItem.productos.some(p => `${p.producto_id}|${p.ubicacion || 'SIN_UBICACION'}` === key )
  if (!existe) {
    const [productoId, ubicacion] = key.split('|')
    ajustes.push({
      producto_id: productoId,
      ubicacion: ubicacion === 'SIN_UBICACION' ? null : ubicacion,
      diferencia: -cantidadOriginal,
      producto_nombre: editandoSalida.productos.find(p => p.producto_id === productoId)?.producto_nombre || productoId,
      producto_codigo: editandoSalida.productos.find(p => p.producto_id === productoId)?.producto_codigo || productoId
    })
  }
}
      
    } else if (editandoSalida.tipo === 'multiple') {
      updatedItem.motivo = editFormData.motivo
      updatedItem.cliente = editFormData.cliente
      updatedItem.notas = editFormData.notas
      updatedItem.fecha = editFormData.fecha
      
      const productosOriginales = {}
      editandoSalida.productos.forEach(p => {
        const key = `${p.producto_id}|${p.ubicacion || 'SIN_UBICACION'}`
        productosOriginales[key] = p.cantidad
  })
      
      updatedItem.productos = editProductosKit.map(p => ({
        ...p,
        cantidad: p.cantidad_por_kit
      }))
      
      for (const producto of updatedItem.productos) {
       const key = `${producto.producto_id}|${producto.ubicacion || 'SIN_UBICACION'}`
       const cantidadOriginal = productosOriginales[key] || 0
       const cantidadNueva = producto.cantidad
       const diferencia = cantidadNueva - cantidadOriginal
        
        if (diferencia !== 0) {
          ajustes.push({
            producto_id: producto.producto_id,
            ubicacion: producto.ubicacion,
            diferencia: diferencia,
            producto_nombre: producto.producto_nombre,
            producto_codigo: producto.producto_codigo
          })
        }
      }
      
      for (const [key, cantidadOriginal] of Object.entries(productosOriginales)) {const existe = updatedItem.productos.some(p => `${p.producto_id}|${p.ubicacion || 'SIN_UBICACION'}` === key)
  if (!existe) {
    const [productoId, ubicacion] = key.split('|')
    ajustes.push({
      producto_id: productoId,
      ubicacion: ubicacion === 'SIN_UBICACION' ? null : ubicacion,
      diferencia: -cantidadOriginal,
      producto_nombre: editandoSalida.productos.find(p => p.producto_id === productoId)?.producto_nombre || productoId,
      producto_codigo: editandoSalida.productos.find(p => p.producto_id === productoId)?.producto_codigo || productoId
    })
  }
}
      
    } else {
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
    
    const nuevasPendientes = [...salidasPendientes]
    const index = salidasPendientes.findIndex(s => s.id === editandoSalida.id)
    if (index !== -1) {
      nuevasPendientes[index] = updatedItem
      setSalidasPendientes(nuevasPendientes)
      
      if (ajustes.length > 0) {
        try {
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

  const handleEditUpdateCantidadKit = (index, nuevaCantidad) => {
    if (nuevaCantidad === '') {
      const nuevosProductos = [...editProductosKit]
      nuevosProductos[index].cantidad_por_kit = ''
      setEditProductosKit(nuevosProductos)
      return
    }
    
    const cantidad = parseInt(nuevaCantidad, 10)
    if (!isNaN(cantidad) && cantidad > 0) {
      const nuevosProductos = [...editProductosKit]
      nuevosProductos[index].cantidad_por_kit = cantidad
      if (editandoSalida?.tipo === 'kit') {
        nuevosProductos[index].cantidad_total = cantidad * editCantidad
      } else {
        nuevosProductos[index].cantidad = cantidad
      }
      setEditProductosKit(nuevosProductos)
    }
  }

  const handleEditRemoveProductoKit = (index) => {
    const nuevosProductos = editProductosKit.filter((_, i) => i !== index)
    setEditProductosKit(nuevosProductos)
  }

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

  const handleAgregarProductoAEdicion = async (producto) => {
  // 1. Cargar ubicaciones disponibles para el producto
  const ubicaciones = await cargarUbicacionesProducto(producto.codigo)
  
  if (!ubicaciones || ubicaciones.length === 0) {
    setSnackbar({ 
      open: true, 
      message: `⚠️ El producto ${producto.nombre} no tiene stock en ninguna ubicación.`, 
      severity: 'warning' 
    })
    return
  }
  
  // 2. Seleccionar ubicación (igual que en handleSelectProduct)
  let ubicacionSeleccionada = null
  let stockEnUbicacion = 0
  
  if (ubicaciones.length > 1) {
    const opciones = ubicaciones.map((ub, idx) => 
      `${idx + 1}. ${ub.ubicacion} (${ub.stock_disponible} disponibles)`
    ).join('\n')
    
    const seleccion = prompt(
      `Selecciona ubicación para ${producto.nombre}:\n\n${opciones}\n\nIngresa el número de la ubicación:`
    )
    
    if (!seleccion) return
    
    const idxSeleccionado = parseInt(seleccion) - 1
    if (isNaN(idxSeleccionado) || idxSeleccionado < 0 || idxSeleccionado >= ubicaciones.length) {
      setSnackbar({ open: true, message: 'Selección no válida', severity: 'error' })
      return
    }
    
    ubicacionSeleccionada = ubicaciones[idxSeleccionado]
    stockEnUbicacion = ubicacionSeleccionada.stock_disponible
  } else {
    ubicacionSeleccionada = ubicaciones[0]
    stockEnUbicacion = ubicacionSeleccionada.stock_disponible
  }
  
  // 3. Agregar a la edición con la ubicación seleccionada
  if (editandoSalida.tipo === 'kit' || editandoSalida.tipo === 'multiple') {
    const existente = editProductosKit.find(p => p.producto_id === producto.id && p.ubicacion === ubicacionSeleccionada.ubicacion)
    
    if (existente) {
      // Si ya existe el mismo producto en la misma ubicación, sumar cantidad
      const nuevosProductos = editProductosKit.map(p =>
        p.producto_id === producto.id && p.ubicacion === ubicacionSeleccionada.ubicacion
          ? { ...p, cantidad_por_kit: p.cantidad_por_kit + 1, cantidad_total: (p.cantidad_por_kit + 1) * (editandoSalida.cantidad_kits || 1) }
          : p
      )
      setEditProductosKit(nuevosProductos)
      setSnackbar({ open: true, message: `${producto.nombre}: +1 unidad en ${ubicacionSeleccionada.ubicacion}`, severity: 'success' })
    } else {
      // Nuevo producto en esta ubicación
      setEditProductosKit(prev => [
        ...prev,
        {
          producto_id: producto.id,
          producto_nombre: producto.nombre,
          producto_codigo: producto.codigo,
          ubicacion: ubicacionSeleccionada.ubicacion,
          cantidad_por_kit: 1,
          cantidad_total: 1,
          stock_disponible: stockEnUbicacion
        }
      ])
      setSnackbar({ open: true, message: `${producto.nombre} agregado en ${ubicacionSeleccionada.ubicacion}`, severity: 'success' })
    }
  } else {
    // Modo normal -> convertir a múltiple
    const confirmar = window.confirm(
      `Esta salida actualmente tiene el producto "${editandoSalida.producto_nombre}".\n\n` +
      `¿Deseas agregar "${producto.nombre}" en ${ubicacionSeleccionada.ubicacion}? Esto convertirá la salida en una salida MÚLTIPLE.\n\n` +
      `¿Continuar?`
    )
    
    if (confirmar) {
      const nuevosProductos = [
        {
          producto_id: editandoSalida.producto_id,
          producto_nombre: editandoSalida.producto_nombre,
          producto_codigo: editandoSalida.producto_codigo,
          ubicacion: editandoSalida.ubicacion || 'SIN_UBICACION',
          cantidad_por_kit: editandoSalida.cantidad,
          cantidad_total: editandoSalida.cantidad,
          stock_disponible: editandoSalida.stock_actual
        },
        {
          producto_id: producto.id,
          producto_nombre: producto.nombre,
          producto_codigo: producto.codigo,
          ubicacion: ubicacionSeleccionada.ubicacion,
          cantidad_por_kit: 1,
          cantidad_total: 1,
          stock_disponible: stockEnUbicacion
        }
      ]
      
      setEditandoSalida(prev => ({
        ...prev,
        tipo: 'multiple',
        nombre: `Salida múltiple (${editandoSalida.producto_nombre} + ${producto.nombre})`,
        productos: nuevosProductos
      }))
      setEditProductosKit(nuevosProductos)
      setSnackbar({ open: true, message: `Salida convertida a MÚLTIPLE con 2 productos`, severity: 'success' })
    }
  }
  
  setEditSearchTerm('')
  setEditShowSearchResults(false)
}

  const handleVerDetallePendiente = (item) => {
    setDetalleSalida(item)
    setDetalleModalOpen(true)
  }
  
  const generarComprobanteMultiple = async (salidas) => {
  setPdfLoading(true)
  try {
    // Asegurar que cada salida tenga los datos necesarios
   const salidasConDatos = salidas.map(s => {
      // Para kits y múltiples, los productos ya están en s.productos
      // Para modo normal, crear array de productos
      let productosArray = s.productos || []
      if (s.tipo === 'normal' && s.producto_nombre) {
        productosArray = [{
          producto_nombre: s.producto_nombre,
          producto_codigo: s.producto_codigo,
          cantidad: s.cantidad,
          ubicacion: s.ubicacion
        }]
      }
      
      return {
        nombre: s.nombre || s.producto_nombre || 'Salida',
        cliente: s.cliente || 'No especificado',
        remision: s.remision || 'N/A',
        caso: s.caso || 'N/A',
        cajas: s.cajas || 1,
        productos: productosArray,
        tipo: s.tipo
      }
    })
    
    console.log('📦 Datos enviados al PDF:', JSON.stringify(salidasConDatos, null, 2))
       
    const blob = await salidasService.generarComprobanteMultiple(salidasConDatos)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `comprobante_salidas_${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    setSnackbar({ open: true, message: '✅ Comprobante múltiple generado', severity: 'success' })
  } catch (error) {
    console.error('Error generando comprobante múltiple:', error)
    setSnackbar({ open: true, message: 'Error al generar comprobante múltiple', severity: 'error' })
  } finally {
    setPdfLoading(false)
  }
}
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
    if (isModoKit || isModoAyudasUnidades) {
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
      setSnackbar({ open: true, message: `${productos.length} productos agregados`, severity: 'success' })
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
    if (s.tipo === 'multiple') {
      return sum + s.productos.reduce((ss, p) => ss + p.cantidad, 0)
    }
    return sum + s.cantidad
  }, 0)
  const totalKits = salidasPendientes.filter(s => s.tipo === 'kit').length
  console.log('🔍 VALORES ACTUALES:', {
  isModoMercadoPredefinido,
  mercadoSeleccionado: mercadoSeleccionado,
  cliente: formData.cliente,
  clienteTrim: formData.cliente?.trim(),
  cond1: !mercadoSeleccionado,
  cond2: !formData.cliente?.trim(),
  resultado: (isModoMercadoPredefinido && (!mercadoSeleccionado || !formData.cliente?.trim()))
})
  console.log('🎯 BOTÓN FINAL - disabled:', 
  (isModoNormal && !productoSeleccionado), 
  (isModoAyudasUnidades && productosKit.length === 0),
  (isModoKit && (productosKit.length === 0 || !formData.kitNombre)),
  (isModoMercadoPredefinido && (!mercadoSeleccionado || !formData.cliente.trim())),
  '=> resultado:',
  (isModoNormal && !productoSeleccionado) || 
  (isModoAyudasUnidades && productosKit.length === 0) ||
  (isModoKit && (productosKit.length === 0 || !formData.kitNombre)) ||
  (isModoMercadoPredefinido && (!mercadoSeleccionado || !formData.cliente.trim()))
)
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
            
            {/* Producto Seleccionado (Modo Normal) */}
            {isModoNormal && productoSeleccionado && (
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
                <Typography variant="caption" color="text.secondary" display="block">
      📍 Ubicación seleccionada: {productoSeleccionado.ubicacion || 'Sin asignar'}
    </Typography>
                <Typography variant="caption" color={productoSeleccionado.stock_en_ubicacion <= (productoSeleccionado.stock_minimo || 5) ? 'error' : 'text.secondary'}>
      Stock disponible en ubicación: {productoSeleccionado.stock_en_ubicacion || 0}
    </Typography>
                {stockCheck.advertencia && (
                  <Alert severity="warning" sx={{ mt: 1 }}>{stockCheck.advertencia}</Alert>
                )}
              </Box>
            )}
            
            {/* Productos del Kit/Lista (Modo Kit o Modo Ayudas/Unidades) */}
            {(isModoKit || isModoAyudasUnidades) && productosKit.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: isModoKit ? 'success.50' : 'info.50', borderRadius: 2, border: '1px solid', borderColor: isModoKit ? 'success.main' : 'info.main' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isModoKit ? <KitIcon /> : <BoxIcon />} 
                    {isModoKit ? 'Productos del Kit' : 'Productos seleccionados'}
                    <Chip label={productosKit.length} size="small" color={isModoKit ? "success" : "info"} />
                  </Typography>
                  <Button size="small" color="error" onClick={handleClearKit}>
                    Limpiar
                  </Button>
                </Box>
                
                {productosKit.map((producto, index) => {
      const cantidadTotal = isModoKit 
        ? (producto.cantidad_por_kit || 0) * (formData.cantidadKits || 1)
        : (producto.cantidad_por_kit || 0)
      const stockEnUbicacion = producto.stock_en_ubicacion || 0
      const tieneStockSuficiente = cantidadTotal <= stockEnUbicacion
      
      return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="medium">{producto.nombre}</Typography>
            <Typography variant="caption" color="text.secondary">{producto.codigo}</Typography>
            <Typography variant="caption" color="primary" display="block">
              📍 Ubicación: {producto.ubicacion || 'No seleccionada'}
            </Typography>
            <Typography 
              variant="caption" 
              color={!tieneStockSuficiente ? 'error' : (stockEnUbicacion <= (producto.stock_minimo || 5) ? 'warning' : 'text.secondary')}
              sx={{ display: 'block', fontWeight: !tieneStockSuficiente ? 'bold' : 'normal' }}
            >
              Stock en ubicación: {stockEnUbicacion} unidades
              {!tieneStockSuficiente && (
                <span style={{ color: 'red', marginLeft: 8 }}>
                  ⚠️ Insuficiente: necesita {cantidadTotal}
                </span>
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              type="text"
              size="small"
              value={producto.cantidad_por_kit}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  handleUpdateCantidadKit(index, '')
                } else if (/^\d+$/.test(value)) {
                  const numValue = parseInt(value, 10)
                  if (numValue > 0) {
                    handleUpdateCantidadKit(index, numValue)
                  }
                }
              }}
              onBlur={() => {
                if (!producto.cantidad_por_kit || producto.cantidad_por_kit === 0 || producto.cantidad_por_kit === '') {
                  handleUpdateCantidadKit(index, 1)
                }
              }}
              sx={{ width: 80 }}
              InputProps={{
                inputProps: { 
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  style: { textAlign: 'center' }
                }
              }}
            />
            <Typography variant="body2">{isModoKit ? 'unid/kit' : 'unidades'}</Typography>
            <IconButton size="small" color="error" onClick={() => handleRemoveProductoKit(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )
    })}
  </Box>
)}
            
            <Divider sx={{ my: 3 }} />
            
<<<<<<< HEAD
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
  onChange={(e) => {
    setFormData({ 
      ...formData, 
      motivo: e.target.value,
      remision: generarRMSecuencial()  // ← Generar nuevo RM al cambiar motivo
    })
    setProductosKit([])
    setProductoSeleccionado(null)
  }}
>
                  {motivos.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {isModoNormal && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cantidad *"
                    value={formData.cantidad}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData(prev => ({ ...prev, cantidad: value === '' ? '' : Number(value) }))
                    }}
                    onBlur={() => {
                      if (!formData.cantidad || formData.cantidad <= 0) {
                        setFormData(prev => ({ ...prev, cantidad: 1 }))
                      }
                    }}
                    inputProps={{ min: 1, step: 1 }}
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
                      value={formData.cantidadKits === 0 ? '' : formData.cantidadKits}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '') {
                          setFormData(prev => ({ ...prev, cantidadKits: '' }))
                        } else {
                          const numValue = parseInt(value, 10)
                          if (!isNaN(numValue) && numValue > 0) {
                            handleUpdateCantidadKits(value)
                          }
                        }
                      }}
                      onBlur={() => {
                        if (!formData.cantidadKits || formData.cantidadKits <= 0) {
                          setFormData(prev => ({ ...prev, cantidadKits: 1 }))
                        }
                      }}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>
                </>
              )}
              {isModoMercadoPredefinido && (
  <>
    <Grid item xs={12}>
      <TextField
        fullWidth
        select
        label="Seleccionar Mercado *"
        value={formData.mercadoSeleccionado}
        onChange={async (e) => {
  const mercado = e.target.value
  console.log('📦 SELECCIONANDO MERCADO:', mercado)
  setMercadoSeleccionado(mercado)
  console.log('📦 mercadoSeleccionado después de set:', mercado)
  setFormData(prev => ({ ...prev, mercadoSeleccionado: mercado }))
  if (mercado) {
    await cargarMercadoPredefinido(mercado)
  }
}}
      >
        <MenuItem value="MERCADO_BASICO">Mercado Básico</MenuItem>
        <MenuItem value="MERCADO_GRANDE">Mercado Grande</MenuItem>
      </TextField>
    </Grid>
    
=======
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
      onChange={(e) => {
        setFormData({ ...formData, motivo: e.target.value })
        setProductosKit([])
        setProductoSeleccionado(null)
      }}
    >
      {motivos.map((m) => (
        <MenuItem key={m} value={m}>{m}</MenuItem>
      ))}
    </TextField>
  </Grid>
  
  {isModoNormal && (
>>>>>>> 57cc1208e7e45d1c03831d942ae82ebef1193388
    <Grid item xs={12}>
      <TextField
        fullWidth
        type="number"
<<<<<<< HEAD
        label="Cantidad de Mercados *"
        value={formData.cantidadKits}
        onChange={(e) => setFormData(prev => ({ ...prev, cantidadKits: parseInt(e.target.value) || 1 }))}
        inputProps={{ min: 1 }}
      />
    </Grid>
    
    {/* Mostrar productos del mercado */}
    {mercadoCargado && (
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            📦 Productos del {mercadoCargado.nombre === 'MERCADO_BASICO' ? 'Mercado Básico' : 'Mercado Grande'}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad x Mercado</TableCell>
                  <TableCell align="center">Total para {formData.cantidadKits}</TableCell>
                  <TableCell align="center">Stock Disponible</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mercadoCargado.productos.map((p, idx) => {
                  const totalNecesario = p.cantidad * formData.cantidadKits
                  const hayStock = p.stock_disponible >= totalNecesario
                  return (
                    <TableRow key={idx}>
                      <TableCell>{p.producto_nombre}</TableCell>
                      <TableCell align="center">{p.cantidad}</TableCell>
                      <TableCell align="center">
                        <Typography color={!hayStock ? 'error' : 'inherit'} fontWeight={!hayStock ? 'bold' : 'normal'}>
                          {totalNecesario}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${p.stock_disponible} unid.`} 
                          size="small" 
                          color={p.stock_disponible <= 5 ? 'error' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    )}
  </>
)}
              <Grid item xs={12}>
                <TextField
  fullWidth
  label={isModoMercadoPredefinido ? "Nombre del Beneficiario *" : "Cliente/Destino/Beneficiario"}
  value={formData.cliente}
  onChange={(e) => {
  const value = e.target.value
  console.log('👤 Cliente cambiado a:', value)
  setFormData(prev => ({ ...prev, cliente: value }))
}}
  placeholder={isModoMercadoPredefinido ? "Nombre del beneficiario *" : "Nombre del cliente o destino..."}
  required={isModoMercadoPredefinido || isModoKit || isModoAyudasUnidades}
/>
              </Grid>
              
<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Número de Caso"
    value={formData.caso}
    onChange={(e) => setFormData({ ...formData, caso: e.target.value })}
    placeholder="Ej: CASO-001"
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
                disabled={
  (formData.motivo !== 'Mercado Predefinido' && isModoNormal && !productoSeleccionado) || 
  (isModoAyudasUnidades && productosKit.length === 0) ||
  (isModoKit && (productosKit.length === 0 || !formData.kitNombre)) ||
  (isModoMercadoPredefinido && (!mercadoSeleccionado || !formData.cliente.trim()))
}
              >
                Agregar a la Lista
              </Button>
              <Button variant="outlined" onClick={handleClearForm}>
                Limpiar
              </Button>
            </Box>
=======
        label="Cantidad *"
        value={formData.cantidad}
        onChange={(e) => {
          const value = e.target.value
          setFormData(prev => ({ ...prev, cantidad: value === '' ? '' : Number(value) }))
        }}
        onBlur={() => {
          if (!formData.cantidad || formData.cantidad <= 0) {
            setFormData(prev => ({ ...prev, cantidad: 1 }))
          }
        }}
        inputProps={{ min: 1, step: 1 }}
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
          value={formData.cantidadKits === 0 ? '' : formData.cantidadKits}
          onChange={(e) => {
            const value = e.target.value
            if (value === '') {
              setFormData(prev => ({ ...prev, cantidadKits: '' }))
            } else {
              const numValue = parseInt(value, 10)
              if (!isNaN(numValue) && numValue > 0) {
                handleUpdateCantidadKits(value)
              }
            }
          }}
          onBlur={() => {
            if (!formData.cantidadKits || formData.cantidadKits <= 0) {
              setFormData(prev => ({ ...prev, cantidadKits: 1 }))
            }
          }}
          inputProps={{ min: 1, step: 1 }}
        />
      </Grid>
    </>
  )}
  
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Cliente/Destino/Beneficiario"
      value={formData.cliente}
      onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
      placeholder={isModoKit || isModoAyudasUnidades ? "Nombre del beneficiario *" : "Nombre del cliente o destino..."}
      required={isModoKit || isModoAyudasUnidades}
    />
  </Grid>
  
  {/* ✅ CAMPO REFERENCIA - COLOCAR AQUÍ */}
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Referencia"
      value={formData.referencia || ''}
      onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
      placeholder="Ej: Donación-001, Factura #123, Ayuda humanitaria"
      helperText="Número de factura, donación o referencia externa"
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
    onClick={isModoMercado ? handleCrearSalidaMercado : handleAgregarALista}
    disabled={hayErroresStock() || 
      (isModoMercado && !formData.cliente) ||
      (isModoNormal && !productoSeleccionado) || 
      ((isModoKit || isModoAyudasUnidades) && productosKit.length === 0) ||
      (isModoKit && !formData.kitNombre)}
  >
    {isModoMercado ? 'Registrar Mercado' : 'Agregar a la Lista'}
  </Button>
  <Button variant="outlined" onClick={handleClearForm}>
    Limpiar
  </Button>
</Box>
>>>>>>> 57cc1208e7e45d1c03831d942ae82ebef1193388
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
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    {selectedSalidas.length > 0 && (
      <Button
        variant="contained"
        color="primary"
        startIcon={<CheckCircleIcon />}
        onClick={handleConfirmarMultiples}
        disabled={confirmacionEnProceso || loading}
      >
        Confirmar {selectedSalidas.length} seleccionada(s)
      </Button>
    )}
    <Typography variant="caption" color="text.secondary">
      Total unidades: {totalUnidadesPendientes}
    </Typography>
  </Box>
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
  <Paper key={item.id} sx={{ mb: 2, p: 2, bgcolor: item.tipo === 'kit' ? 'info.50' : item.tipo === 'multiple' ? 'secondary.50' : 'grey.50' }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
      
      {/* CHECKBOX */}
      <Checkbox
        checked={selectedSalidas.includes(item.id)}
        onChange={() => handleToggleSelect(item.id)}
        disabled={confirmacionEnProceso || loading}
      />
      
      {/* 📦 CAMPO PARA NÚMERO DE CAJAS - DEBE SER VISIBLE */}
      <TextField
        type="number"
        size="small"
        label="Cajas"
        value={cajasPorSalida[item.id] || ''}
        onChange={(e) => setCajasPorSalida(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 0 }))}
        sx={{ width: 80 }}
        inputProps={{ min: 0, style: { textAlign: 'center' } }}
      />
      
      {/* Contenido existente */}
      <Box sx={{ flex: 1 }}>
        {/* TODO el contenido existente que estaba dentro del Box con flex:1 */}
        {item.tipo === 'kit' ? (
          <>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KitIcon /> {item.nombre}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              {item.remision && (
                <Chip label={`RM: ${item.remision}`} size="small" color="info" variant="outlined" />
              )}
              {item.caso && (
                <Chip label={`Caso: ${item.caso}`} size="small" color="secondary" variant="outlined" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
              📍 Ubicaciones: {item.productos.map(p => `${p.ubicacion || 'Sin ubicación'} (${p.cantidad_total})`).join(', ')}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {item.motivo} • Beneficiario: {item.cliente || 'No especificado'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {item.cantidad_kits} kits × {item.productos.length} productos ({item.productos.reduce((sum, p) => sum + p.cantidad_total, 0)} unidades totales)
            </Typography>
          </>
        ) : item.tipo === 'multiple' ? (
          <>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoxIcon /> {item.nombre}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              {item.remision && (
                <Chip label={`RM: ${item.remision}`} size="small" color="info" variant="outlined" />
              )}
              {item.caso && (
                <Chip label={`Caso: ${item.caso}`} size="small" color="secondary" variant="outlined" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
              📍 Ubicaciones: {item.productos.map(p => `${p.ubicacion || 'Sin ubicación'} (${p.cantidad})`).join(', ')}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {item.motivo} • Beneficiario: {item.cliente || 'No especificado'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {item.productos.length} productos ({item.productos.reduce((sum, p) => sum + p.cantidad, 0)} unidades totales)
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              {item.productos.map(p => `${p.producto_nombre} (${p.cantidad})`).join(', ').substring(0, 80)}...
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="subtitle2" fontWeight="bold">
              {item.producto_nombre}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              {item.remision && (
                <Chip label={`RM: ${item.remision}`} size="small" color="info" variant="outlined" />
              )}
              {item.caso && (
                <Chip label={`Caso: ${item.caso}`} size="small" color="secondary" variant="outlined" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
              📍 Ubicación: {item.ubicacion || 'Sin asignar'} • {item.motivo} • {item.cliente ? `Destino: ${item.cliente}` : ''}
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
      
      {/* Botones de acción y chip */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Chip 
          label={
            item.tipo === 'kit' ? `${item.cantidad_kits} kits` : 
            item.tipo === 'multiple' ? `${item.productos.length} prod.` : 
            `${item.cantidad} unid.`
          } 
          size="small" 
          color="warning" 
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => handleVerDetallePendiente(item)} title="Ver detalles">
            <VisibilityIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleEditarSalida(item)} title="Editar" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="success" onClick={async () => { await confirmarUnaSalida(item, index, false) }} title="Confirmar salida" disabled={loading}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleEliminarPendiente(index)} title="Eliminar">
            <DeleteIcon />
          </IconButton>
        </Box>
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
                <Typography variant="body2"><strong>Cliente/Destino/Beneficiario:</strong> {detalleSalida.cliente || 'No especificado'}</Typography>
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
              ) : detalleSalida.tipo === 'multiple' ? (
                <>
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
                        {detalleSalida.productos.map((p, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{p.producto_nombre}</TableCell>
                            <TableCell>{p.producto_codigo}</TableCell>
                            <TableCell align="right">{p.cantidad}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell colSpan={2}><strong>Total</strong></TableCell>
                          <TableCell align="right"><strong>{detalleSalida.productos.reduce((sum, p) => sum + p.cantidad, 0)}</strong></TableCell>
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
      {/* Modal de selección de ubicación */}
<Dialog open={showUbicacionSelector} onClose={() => setShowUbicacionSelector(false)} maxWidth="sm" fullWidth>
  <DialogTitle>
    Seleccionar ubicación para {productoParaSeleccion?.nombre}
  </DialogTitle>
  <DialogContent>
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Stock disponible por ubicación:
      </Typography>
      {(!ubicacionesDisponibles || ubicacionesDisponibles.length === 0) ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No hay ubicaciones disponibles con stock para este producto.
          <Button 
            size="small" 
            sx={{ ml: 2 }}
            onClick={() => {
              setShowUbicacionSelector(false)
              router.push(`/inventario/productos/${productoParaSeleccion?.id}`)
            }}
          >
            Gestionar Ubicaciones
          </Button>
        </Alert>
      ) : (
        <List>
          {ubicacionesDisponibles.map((ub) => (
            <ListItem 
              key={ub.ubicacion}
              button
              onClick={() => {
                setProductoSeleccionado({
                  ...productoParaSeleccion,
                  ubicacion: ub.ubicacion,
                  stock_en_ubicacion: ub.stock_disponible
                })
                setFormData(prev => ({ ...prev, cantidad: 1 }))
                setShowUbicacionSelector(false)
                setSnackbar({ 
                  open: true, 
                  message: `Producto seleccionado: ${productoParaSeleccion?.nombre} (${ub.ubicacion})`, 
                  severity: 'success' 
                })
              }}
            >
              <ListItemText 
                primary={`📍 ${ub.ubicacion}`}
                secondary={`Stock disponible: ${ub.stock_disponible} unidades`}
              />
              <Chip 
                label={`${ub.stock_disponible} unid.`} 
                size="small" 
                color={ub.stock_disponible <= 5 ? 'error' : 'success'}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowUbicacionSelector(false)}>Cancelar</Button>
  </DialogActions>
</Dialog>
      {/* Modal de Edición de Salida */}
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
                  {editandoSalida.tipo === 'kit' ? `Kit: ${editandoSalida.nombre}` : 
                   editandoSalida.tipo === 'multiple' ? `Múltiple: ${editandoSalida.nombre}` :
                   `Producto: ${editandoSalida.producto_nombre}`}
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
                    label={editandoSalida.tipo === 'kit' || editandoSalida.tipo === 'multiple' ? "Beneficiario" : "Cliente/Destino"}
                    value={editFormData.cliente}
                    onChange={(e) => setEditFormData({ ...editFormData, cliente: e.target.value })}
                  />
                </Grid>
                
                {(editandoSalida.tipo === 'kit' || editandoSalida.tipo === 'multiple') && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label={editandoSalida.tipo === 'kit' ? "Cantidad de Kits" : "Cantidad (multiplicador)"}
                      value={editCantidad === 0 ? '' : editCantidad}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '') {
                          setEditCantidad('')
                        } else {
                          const numValue = parseInt(value, 10)
                          if (!isNaN(numValue) && numValue > 0) {
                            setEditCantidad(numValue)
                            // Actualizar cantidades totales en los productos
                            const nuevosProductos = editProductosKit.map(p => ({
                              ...p,
                              cantidad_total: p.cantidad_por_kit * numValue
                            }))
                            setEditProductosKit(nuevosProductos)
                          }
                        }
                      }}
                      onBlur={() => {
                        if (!editCantidad || editCantidad <= 0) {
                          setEditCantidad(1)
                        }
                      }}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>
                )}
                
                {!editandoSalida.tipo !== 'kit' && !editandoSalida.tipo !== 'multiple' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Cantidad"
                      value={editCantidad === 0 ? '' : editCantidad}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '') {
                          setEditCantidad('')
                        } else {
                          const numValue = parseInt(value, 10)
                          if (!isNaN(numValue) && numValue > 0) {
                            setEditCantidad(numValue)
                          }
                        }
                      }}
                      onBlur={() => {
                        if (!editCantidad || editCantidad <= 0) {
                          setEditCantidad(1)
                        }
                      }}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>
                )}
                
                {(editandoSalida.tipo === 'kit' || editandoSalida.tipo === 'multiple') && editProductosKit.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {editandoSalida.tipo === 'kit' ? 'Productos del Kit:' : 'Productos:'}
                    </Typography>
                    {editProductosKit.map((producto, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="medium">{producto.producto_nombre}</Typography>
                          <Typography variant="caption" color="text.secondary">{producto.producto_codigo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="text"
                            size="small"
                            value={producto.cantidad_por_kit}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value === '') {
                                const nuevosProductos = [...editProductosKit]
                                nuevosProductos[idx].cantidad_por_kit = ''
                                setEditProductosKit(nuevosProductos)
                              } else if (/^\d+$/.test(value)) {
                                const numValue = parseInt(value, 10)
                                if (numValue > 0) {
                                  const nuevosProductos = [...editProductosKit]
                                  nuevosProductos[idx].cantidad_por_kit = numValue
                                  if (editandoSalida.tipo === 'kit') {
                                    nuevosProductos[idx].cantidad_total = numValue * editCantidad
                                  } else {
                                    nuevosProductos[idx].cantidad = numValue
                                  }
                                  setEditProductosKit(nuevosProductos)
                                }
                              }
                            }}
                            onBlur={() => {
                              if (!producto.cantidad_por_kit || producto.cantidad_por_kit === 0 || producto.cantidad_por_kit === '') {
                                const nuevosProductos = [...editProductosKit]
                                nuevosProductos[idx].cantidad_por_kit = 1
                                if (editandoSalida.tipo === 'kit') {
                                  nuevosProductos[idx].cantidad_total = 1 * editCantidad
                                } else {
                                  nuevosProductos[idx].cantidad = 1
                                }
                                setEditProductosKit(nuevosProductos)
                              }
                            }}
                            sx={{ width: 80 }}
                            InputProps={{
                              inputProps: { 
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                style: { textAlign: 'center' }
                              }
                            }}
                          />
                          <Typography variant="body2">
                            {editandoSalida.tipo === 'kit' ? 'unid/kit' : 'unidades'}
                          </Typography>
                          <IconButton size="small" color="error" onClick={() => handleEditRemoveProductoKit(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                )}
                
                {/* Sección para agregar productos */}
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
                          component="div"
                          onClick={() => handleAgregarProductoAEdicion(producto)}
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