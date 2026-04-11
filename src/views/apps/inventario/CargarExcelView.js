import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material'
import {
  FileCopy as ExcelIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material'
import { excelService } from 'src/services/inventario/excel.service'
import FileDropzone from './components/FileDropzone'

const CargarExcelView = () => {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [resultados, setResultados] = useState(null)
  const [expandedRows, setExpandedRows] = useState({})

  const handleFileSelect = (selectedFile) => {
    const validacion = excelService.validarArchivo(selectedFile)
    if (validacion.valido) {
      setFile(selectedFile)
      setError(null)
    } else {
      setError(validacion.error)
    }
  }

  const handleFileRemove = () => {
    setFile(null)
    setError(null)
  }

  const handleCargar = async () => {
    if (!file) return
    
    setLoading(true)
    setProgress(0)
    setError(null)
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 300)
      
      const result = await excelService.cargarExcel(file)
      
      clearInterval(progressInterval)
      setProgress(100)
      setResultados(result)
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar el archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleDescargarPlantilla = async () => {
    try {
      const blob = await excelService.descargarPlantilla()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'plantilla_productos.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setError('Error al descargar la plantilla')
    }
  }

  const handleCargarOtro = () => {
    setFile(null)
    setResultados(null)
    setProgress(0)
    setError(null)
  }

  const toggleRowExpand = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  if (resultados) {
    const totalExitosos = resultados.exitosos || 0
    const totalFallidos = resultados.fallidos || 0
    const tieneErrores = totalFallidos > 0
    
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCargarOtro}
            sx={{ mb: 2 }}
          >
            Cargar otro archivo
          </Button>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ExcelIcon sx={{ color: '#10b981' }} />
            Resultado de la Carga
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">
                  {resultados.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Productos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">
                  {totalExitosos}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <CheckIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> Creados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main">
                  {totalFallidos}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <ErrorIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> Fallidos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {tieneErrores && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Importante:</strong> Algunos productos no se crearon debido a problemas con los códigos.
            <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
              <li>Códigos vacíos o inválidos</li>
              <li>Códigos duplicados en el Excel</li>
              <li>Códigos que ya existen en la base de datos</li>
            </ul>
          </Alert>
        )}

        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.productos?.map((producto, index) => {
                  const isExitoso = producto.exitoso
                  const errorInfo = !isExitoso && producto.error ? producto.error : null
                  const isExpanded = expandedRows[index]
                  
                  return (
                    <>
                      <TableRow key={index} hover>
                        <TableCell padding="checkbox">
                          {errorInfo && (
                            <IconButton size="small" onClick={() => toggleRowExpand(index)}>
                              {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {producto.codigo || '---'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {producto.nombre || 'Sin nombre'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={producto.categoria || 'Sin categoría'} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {isExitoso ? (
                            <Chip
                              icon={<CheckIcon />}
                              label="Creado"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<ErrorIcon />}
                              label="Error"
                              color="error"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {isExitoso && (
                            <Tooltip title="Ver producto">
                              <IconButton
                                size="small"
                                onClick={() => router.push(`/inventario/productos/${producto.id}`)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                      {errorInfo && isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ py: 0, bgcolor: 'error.50' }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 2 }}>
                                <Alert severity="error" icon={<ErrorIcon />}>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Error al crear el producto
                                  </Typography>
                                  <Typography variant="body2">
                                    {errorInfo}
                                  </Typography>
                                </Alert>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCargarOtro}
            startIcon={<ExcelIcon />}
          >
            Cargar otro archivo
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/inventario/productos')}
            startIcon={<ArrowBackIcon />}
          >
            Ver Productos
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ExcelIcon sx={{ color: '#10b981' }} />
          Cargar Productos desde Excel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sube un archivo con todos los productos que quieres crear
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Formato del archivo:</strong> Excel (.xlsx) o CSV con las siguientes columnas:
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', marginBottom: 0 }}>
          <li><strong>nombre</strong> - Nombre del producto (obligatorio)</li>
          <li><strong>descripcion</strong> - Descripción (opcional)</li>
          <li><strong>categoria</strong> - Categoría (opcional)</li>
          <li><strong>stock_minimo</strong> - Stock mínimo (opcional, por defecto 0)</li>
        </ul>
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon /> Subir Archivo
        </Typography>
        
        <FileDropzone
          file={file}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          error={error}
        />
        
        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              {progress < 100 ? 'Procesando archivo...' : 'Finalizando...'}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDescargarPlantilla}
          >
            Descargar Plantilla
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/inventario/productos')}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<ExcelIcon />}
              onClick={handleCargar}
              disabled={!file || loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Carga'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon fontSize="small" /> Sugerencias para la carga masiva:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              ✓ El archivo debe tener una fila de encabezados con los nombres de las columnas
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              ✓ Los códigos se generan automáticamente, no es necesario incluirlos
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              ✓ El campo "nombre" es obligatorio para cada producto
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              ✓ Máximo 1000 productos por carga para mantener rendimiento
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default CargarExcelView