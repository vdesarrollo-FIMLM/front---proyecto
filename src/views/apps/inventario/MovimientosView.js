import { useState, useEffect, useRef, useCallback } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Tooltip,
  LinearProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  FileDownload as ExcelIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Undo as UndoIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  QrCode as QrCodeIcon,
  ShoppingBag as KitIcon
} from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from 'src/hooks/useAuth'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import { movimientosService } from 'src/services/inventario/movimientos.service'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)

const MovimientosView = () => {
  // Estado
  const [movimientos, setMovimientos] = useState([])
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [detalleModalOpen, setDetalleModalOpen] = useState(false)
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  
  // Filtros
  const [filters, setFilters] = useState({
    tipo: '',
    producto_id: '',
    fecha_desde: null,
    fecha_hasta: null,
    motivo: ''
  })
  
  // Paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  
  // Datos para gráficos
  const [graficosData, setGraficosData] = useState({
    movimientosPorDia: { labels: [], data: [] },
    topMotivos: { labels: [], data: [] },
    topProductos: { labels: [], data: [] },
    actividadPorHora: { labels: [], data: [] }
  })
  
  // Estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalEntradas: 0,
    totalSalidas: 0,
    totalUnidadesEntrada: 0,
    totalUnidadesSalida: 0,
    balanceNeto: 0
  })

  const motivos = [
    'Compra', 'Donación', 'Entrega de Ayudas', 'Devolución', 'Ajuste de Inventario',
    'Producción', 'Consumo Interno', 'Dañado', 'Caducado', 'Transferencia', 'Otro'
  ]

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos()
    // Configurar fechas por defecto (últimos 30 días)
    const hoy = new Date()
    const hace30Dias = new Date()
    hace30Dias.setDate(hoy.getDate() - 30)
    setFilters(prev => ({
      ...prev,
      fecha_desde: hace30Dias,
      fecha_hasta: hoy
    }))
  }, [])

  useEffect(() => {
    if (movimientos.length > 0) {
      aplicarFiltros()
    }
  }, [movimientos, filters])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [movs, prods] = await Promise.all([
        movimientosService.getAll(),
        movimientosService.getProductos()
      ])
      setMovimientos(movs)
      setProductos(prods)
      
      // Calcular estadísticas
      const stats = await movimientosService.getEstadisticas(movs)
      setEstadisticas(stats)
      
      // Preparar datos para gráficos
      const graficos = movimientosService.getDatosGraficos(movs)
      setGraficosData(graficos)
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al cargar datos', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let filtrados = [...movimientos]
    
    if (filters.tipo) {
      filtrados = filtrados.filter(m => m.tipo === filters.tipo)
    }
    
    if (filters.producto_id) {
      filtrados = filtrados.filter(m => m.producto_id === parseInt(filters.producto_id))
    }
    
    if (filters.fecha_desde) {
      const desde = new Date(filters.fecha_desde)
      desde.setHours(0, 0, 0, 0)
      filtrados = filtrados.filter(m => new Date(m.fecha_movimiento) >= desde)
    }
    
    if (filters.fecha_hasta) {
      const hasta = new Date(filters.fecha_hasta)
      hasta.setHours(23, 59, 59, 999)
      filtrados = filtrados.filter(m => new Date(m.fecha_movimiento) <= hasta)
    }
    
    if (filters.motivo) {
      filtrados = filtrados.filter(m => m.motivo === filters.motivo)
    }
    
    setMovimientosFiltrados(filtrados)
    setPage(0)
  }

  const resetFilters = () => {
    const hoy = new Date()
    const hace30Dias = new Date()
    hace30Dias.setDate(hoy.getDate() - 30)
    
    setFilters({
      tipo: '',
      producto_id: '',
      fecha_desde: hace30Dias,
      fecha_hasta: hoy,
      motivo: ''
    })
  }

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      const blob = await movimientosService.exportarExcel({
        fecha_desde: filters.fecha_desde?.toISOString().split('T')[0],
        fecha_hasta: filters.fecha_hasta?.toISOString().split('T')[0],
        tipo: filters.tipo
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `movimientos_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setSnackbar({ open: true, message: 'Archivo Excel generado', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al exportar', severity: 'error' })
    } finally {
      setExporting(false)
    }
  }

  const handleVerDetalle = async (movimiento) => {
    setMovimientoSeleccionado(movimiento)
    
    // Obtener info del PDF si es salida
    if (movimiento.tipo === 'salida') {
      try {
        const pdfInfo = await movimientosService.getPDFInfo(movimiento.id)
        setMovimientoSeleccionado(prev => ({ ...prev, pdfInfo }))
      } catch (error) {
        console.error('Error obteniendo info PDF:', error)
      }
    }
    
    setDetalleModalOpen(true)
  }

  const handleRevertirMovimiento = async (movimiento) => {
    if (!movimiento.producto) {
      setSnackbar({ open: true, message: 'No se puede revertir este movimiento', severity: 'error' })
      return
    }
    
    const confirmar = window.confirm(
      `¿Revertir ${movimiento.tipo} de ${movimiento.cantidad} unidades de "${movimiento.producto.nombre}"?\n\n` +
      `Esta acción creará un movimiento contrario.`
    )
    
    if (!confirmar) return
    
    try {
      await movimientosService.revertirMovimiento(movimiento)
      setSnackbar({ open: true, message: 'Movimiento revertido exitosamente', severity: 'success' })
      await cargarDatos()
      setDetalleModalOpen(false)
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al revertir movimiento', severity: 'error' })
    }
  }

  const handleGenerarComprobante = async (movimientoId) => {
    setPdfLoading(true)
    try {
      const blob = await movimientosService.generarComprobante(movimientoId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `comprobante_salida_${movimientoId}_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      setSnackbar({ open: true, message: 'Comprobante generado', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al generar comprobante', severity: 'error' })
    } finally {
      setPdfLoading(false)
    }
  }

  const handleSubirPDF = async (movimientoId) => {
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
      
      if (!confirm(`¿Subir PDF firmado para esta salida?\n\nArchivo: ${file.name}`)) {
        return
      }
      
      setPdfLoading(true)
      try {
        await movimientosService.subirPDFFirmado(movimientoId, file)
        setSnackbar({ open: true, message: 'PDF subido exitosamente', severity: 'success' })
        await cargarDatos()
      } catch (error) {
        setSnackbar({ open: true, message: 'Error al subir PDF', severity: 'error' })
      } finally {
        setPdfLoading(false)
      }
    }
    
    input.click()
  }

  const handleVerPDF = (pdfUrl) => {
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank')
  }

  const getTipoChip = (tipo) => {
  if (tipo === 'entrada') {
    return (
      <Chip
        icon={<ArrowDownIcon />}
        label="Entrada"
        size="small"
        color="success"
        sx={{ fontWeight: 500 }}
      />
    )
  }
  if (tipo === 'salida') {
    return (
      <Chip
        icon={<ArrowUpIcon />}
        label="Salida"
        size="small"
        color="warning"
        sx={{ fontWeight: 500 }}
      />
    )
  }
  if (tipo === 'creacion_ubicacion') {
    return (
      <Chip
        icon={<LocationIcon />}
        label="Creación Ubicación"
        size="small"
        color="info"
        sx={{ fontWeight: 500 }}
      />
    )
  }
  if (tipo === 'transferencia_ubicacion') {
    return (
      <Chip
        icon={<SwapHorizIcon />}
        label="Transferencia"
        size="small"
        color="default"
        sx={{ fontWeight: 500 }}
      />
    )
  }
  return <Chip label={tipo} size="small" />
}

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'success.main'
    if (balance < 0) return 'error.main'
    return 'text.secondary'
  }

  const getBalanceIcon = (balance) => {
    if (balance > 0) return <TrendingUpIcon />
    if (balance < 0) return <TrendingDownIcon />
    return <TrendingFlatIcon />
  }

  const paginatedMovimientos = movimientosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  }

  // Gráficos
  const lineChartData = {
    labels: graficosData.movimientosPorDia.labels,
    datasets: [{
      label: 'Movimientos',
      data: graficosData.movimientosPorDia.data,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }

  const doughnutChartData = {
    labels: graficosData.topMotivos.labels,
    datasets: [{
      data: graficosData.topMotivos.data,
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0
    }]
  }

  const barChartProductosData = {
    labels: graficosData.topProductos.labels,
    datasets: [{
      label: 'Unidades',
      data: graficosData.topProductos.data,
      backgroundColor: '#10b981',
      borderRadius: 4
    }]
  }

  const barChartHorasData = {
    labels: graficosData.actividadPorHora.labels,
    datasets: [{
      label: 'Movimientos',
      data: graficosData.actividadPorHora.data,
      backgroundColor: '#f59e0b',
      borderRadius: 4
    }]
  }

  const barOptions = {
    ...chartOptions,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: false } }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📜 Historial de Movimientos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta todos los movimientos de entrada y salida
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ExcelIcon />}
            onClick={handleExportExcel}
            disabled={exporting}
          >
            {exporting ? <CircularProgress size={20} /> : 'Exportar Excel'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarDatos}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon /> Filtros
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.tipo}
                label="Tipo"
                onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="entrada">Entradas</MenuItem>
                <MenuItem value="salida">Salidas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Producto</InputLabel>
              <Select
                value={filters.producto_id}
                label="Producto"
                onChange={(e) => setFilters({ ...filters, producto_id: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                {productos.map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.codigo} - {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Desde"
                value={filters.fecha_desde}
                onChange={(date) => setFilters({ ...filters, fecha_desde: date })}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Hasta"
                value={filters.fecha_hasta}
                onChange={(date) => setFilters({ ...filters, fecha_hasta: date })}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Motivo</InputLabel>
              <Select
                value={filters.motivo}
                label="Motivo"
                onChange={(e) => setFilters({ ...filters, motivo: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                {motivos.map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={resetFilters}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: 2 }}>
                  <ArrowDownIcon sx={{ color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4">{estadisticas.totalEntradas}</Typography>
                  <Typography variant="body2" color="text.secondary">Entradas Totales</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {estadisticas.totalUnidadesEntrada} unidades
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: 'warning.light', borderRadius: 2 }}>
                  <ArrowUpIcon sx={{ color: 'warning.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4">{estadisticas.totalSalidas}</Typography>
                  <Typography variant="body2" color="text.secondary">Salidas Totales</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {estadisticas.totalUnidadesSalida} unidades
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: 'info.light', borderRadius: 2 }}>
                  {getBalanceIcon(estadisticas.balanceNeto)}
                </Box>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ color: getBalanceColor(estadisticas.balanceNeto) }}
                  >
                    {estadisticas.balanceNeto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Balance Neto</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {estadisticas.balanceNeto >= 0 ? '+' : ''}{estadisticas.balanceNeto} unidades
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Movimientos */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">
            Movimientos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mostrando {paginatedMovimientos.length} de {movimientosFiltrados.length} movimientos
          </Typography>
        </Box>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Fecha</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Proveedor/Cliente</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell align="center">PDF</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMovimientos.map((mov) => {
                const fecha = new Date(mov.fecha_movimiento)
                const origenDestino = mov.tipo === 'entrada' ? mov.origen_nombre : mov.cliente_destino
                const tienePDF = mov.pdf_firmado || mov.pdfInfo?.tiene_pdf
                const pdfUrl = mov.pdf_firmado || mov.pdfInfo?.pdf_url
                
                return (
                  <TableRow key={mov.id} hover>
                    <TableCell>
                      <Typography variant="body2">{fecha.toLocaleDateString()}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fecha.toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
  {mov.es_kit ? (
    <>
      <Tooltip title={
        <Box>
          <Typography variant="caption" fontWeight="bold">Productos del kit:</Typography>
          {mov.productos_kit?.map((p, idx) => (
            <Typography key={idx} variant="caption" display="block">
              • {p.producto_nombre}: {p.cantidad} unidades
            </Typography>
          ))}
        </Box>
      }>
        <Chip 
          icon={<KitIcon />} 
          label={mov.kit_nombre} 
          size="small" 
          variant="outlined"
          sx={{ cursor: 'pointer' }}
        />
      </Tooltip>
      <Typography variant="caption" display="block" color="text.secondary">
        {mov.productos_kit?.length} productos
      </Typography>
    </>
  ) : (
    <>
      <Typography variant="body2" fontWeight="medium">
        {mov.producto?.nombre || 'Producto eliminado'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {mov.producto?.codigo || 'N/A'}
      </Typography>
    </>
  )}
</TableCell>
                    <TableCell>{getTipoChip(mov.tipo)}</TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={mov.tipo === 'entrada' ? 'success.main' : 'error.main'}
                      >
                        {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                      </Typography>
                    </TableCell>
                    <TableCell>{mov.motivo || '-'}</TableCell>
                    <TableCell>{origenDestino || '-'}</TableCell>
                    <TableCell>{mov.ubicacion || '-'}</TableCell>
                    <TableCell>{mov.usuario || 'admin'}</TableCell>
                    <TableCell align="center">
                      {mov.tipo === 'salida' && (
                        tienePDF ? (
                          <Tooltip title="Ver PDF firmado">
                            <IconButton size="small" onClick={() => handleVerPDF(pdfUrl)}>
                              <PdfIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Subir PDF firmado">
                            <IconButton size="small" onClick={() => handleSubirPDF(mov.id)}>
                              <UploadIcon />
                            </IconButton>
                          </Tooltip>
                        )
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" onClick={() => handleVerDetalle(mov)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {mov.tipo === 'salida' && (
                          <Tooltip title="Generar comprobante">
                            <IconButton size="small" onClick={() => handleGenerarComprobante(mov.id)}>
                              <PrintIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Revertir movimiento">
                          <IconButton size="small" color="warning" onClick={() => handleRevertirMovimiento(mov)}>
                            <UndoIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
              
              {movimientosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron movimientos
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={movimientosFiltrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Gráficos */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        📊 Análisis de Movimientos
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Movimientos por Día
            </Typography>
            <Box sx={{ height: 250 }}>
              <Line data={lineChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Distribución por Motivo
            </Typography>
            <Box sx={{ height: 250 }}>
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Top 10 Productos
            </Typography>
            <Box sx={{ height: 250 }}>
              <Bar data={barChartProductosData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Actividad por Hora
            </Typography>
            <Box sx={{ height: 250 }}>
              <Bar data={barChartHorasData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Detalle */}
      <Dialog open={detalleModalOpen} onClose={() => setDetalleModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalle del Movimiento
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setDetalleModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {movimientoSeleccionado && (
            <>
              {/* Header con tipo */}
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 1,
                  bgcolor: movimientoSeleccionado.tipo === 'entrada' ? 'success.light' : 'warning.light',
                  color: movimientoSeleccionado.tipo === 'entrada' ? 'success.dark' : 'warning.dark'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {movimientoSeleccionado.tipo === 'entrada' ? <ArrowDownIcon /> : <ArrowUpIcon />}
                    {movimientoSeleccionado.tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'} #{movimientoSeleccionado.id}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(movimientoSeleccionado.fecha_movimiento).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              
              {/* Información del Producto */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                Producto
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Nombre</Typography>
                  <Typography variant="body1">{movimientoSeleccionado.producto?.nombre || 'Producto eliminado'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Código</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {movimientoSeleccionado.producto?.codigo || 'N/A'}
                  </Typography>
                </Grid>
                {movimientoSeleccionado.producto && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Categoría</Typography>
                      <Typography variant="body1">{movimientoSeleccionado.producto.categoria || 'Sin categoría'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Stock Actual</Typography>
                      <Typography variant="body1" color={movimientoSeleccionado.producto.stock_actual < (movimientoSeleccionado.producto.stock_minimo || 5) ? 'error.main' : 'success.main'}>
                        {movimientoSeleccionado.producto.stock_actual} unidades
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Información del Movimiento */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Movimiento
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Cantidad</Typography>
                  <Typography variant="body1" fontWeight="bold" color={movimientoSeleccionado.tipo === 'entrada' ? 'success.main' : 'error.main'}>
                    {movimientoSeleccionado.tipo === 'entrada' ? '+' : '-'}{movimientoSeleccionado.cantidad} unidades
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Motivo</Typography>
                  <Typography variant="body1">{movimientoSeleccionado.motivo || 'No especificado'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {movimientoSeleccionado.tipo === 'entrada' ? 'Proveedor/Origen' : 'Cliente/Destino'}
                  </Typography>
                  <Typography variant="body1">
                    {movimientoSeleccionado.tipo === 'entrada' 
                      ? movimientoSeleccionado.origen_nombre || 'No especificado'
                      : movimientoSeleccionado.cliente_destino || 'No especificado'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Ubicación</Typography>
                  <Typography variant="body1">{movimientoSeleccionado.ubicacion || 'No especificada'}</Typography>
                </Grid>
              </Grid>
               {movimientoSeleccionado.es_kit && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              📦 Productos del Kit
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>Producto</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movimientoSeleccionado.productos_kit?.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{p.producto_nombre}</TableCell>
                      <TableCell>{p.producto_codigo || p.producto_id}</TableCell>
                      <TableCell align="right">{p.cantidad}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell colSpan={2}><strong>Total kit</strong></TableCell>
                    <TableCell align="right">
                      <strong>{movimientoSeleccionado.productos_kit?.reduce((sum, p) => sum + p.cantidad, 0)} unidades</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
              {/* Notas */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Notas y Observaciones
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Typography variant="body2">
                  {movimientoSeleccionado.notas || <em>Sin notas adicionales</em>}
                </Typography>
              </Paper>
              
              {/* PDF Firmado */}
              {movimientoSeleccionado.tipo === 'salida' && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Remito Firmado
                  </Typography>
                  {movimientoSeleccionado.pdf_firmado || movimientoSeleccionado.pdfInfo?.tiene_pdf ? (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        icon={<PdfIcon />} 
                        label="PDF Firmado" 
                        color="success" 
                        size="small"
                      />
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleVerPDF(movimientoSeleccionado.pdf_firmado || movimientoSeleccionado.pdfInfo?.pdf_url)}
                      >
                        Ver PDF
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<DownloadIcon />}
                        onClick={() => handleVerPDF(movimientoSeleccionado.pdf_firmado || movimientoSeleccionado.pdfInfo?.pdf_url)}
                      >
                        Descargar
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        No se ha subido ningún remito firmado para esta salida.
                      </Typography>
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => handleSubirPDF(movimientoSeleccionado.id)}
                      >
                        Subir Remito Firmado
                      </Button>
                    </Box>
                  )}
                </>
              )}
              
              {/* Información Adicional */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Información Adicional
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Usuario que registró</Typography>
                  <Typography variant="body1">{movimientoSeleccionado.usuario || 'admin'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Fecha de registro</Typography>
                  <Typography variant="body1">{new Date(movimientoSeleccionado.fecha_movimiento).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {movimientoSeleccionado?.tipo === 'salida' && (
            <Button 
              startIcon={<PrintIcon />}
              onClick={() => handleGenerarComprobante(movimientoSeleccionado.id)}
            >
              Generar Comprobante
            </Button>
          )}
          <Button 
            color="warning" 
            startIcon={<UndoIcon />}
            onClick={() => handleRevertirMovimiento(movimientoSeleccionado)}
          >
            Revertir Movimiento
          </Button>
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
      
      {pdfLoading && <LinearProgress sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} />}
    </Container>
  )
}

export default MovimientosView