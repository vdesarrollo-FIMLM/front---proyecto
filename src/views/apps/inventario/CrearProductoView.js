import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material'
import { productosService } from 'src/services/inventario/productos.service'

const CrearProductoView = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: 'General',
    precio_unitario: 0,
    stock_actual: 0,
    stock_minimo: 5,
    ubicacion: ''
  })

  const categorias = [
    'General',
    'Electrónicos',
    'Computadoras',
    'Periféricos',
    'Monitores',
    'Accesorios',
    'Redes',
    'Software',
    'Otros'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio_unitario' || name === 'stock_actual' || name === 'stock_minimo' 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await productosService.create(formData)
      setSnackbar({ open: true, message: 'Producto creado exitosamente', severity: 'success' })
      
      setTimeout(() => {
        router.push('/inventario/productos')
      }, 1500)
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || 'Error al crear producto', 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/inventario/productos')}
        >
          Volver
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Crear Nuevo Producto
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Código */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Código"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ej: PROD-001"
                helperText="Código único del producto (puede ser código de barras o QR)"
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Laptop HP EliteBook"
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Descripción detallada del producto"
              />
            </Grid>

            {/* Categoría */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Categoría"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Precio */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Precio Unitario"
                name="precio_unitario"
                value={formData.precio_unitario}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Typography>$</Typography>,
                }}
                step="0.01"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Información de Inventario
                </Typography>
              </Divider>
            </Grid>

            {/* Stock Actual */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Stock Actual"
                name="stock_actual"
                value={formData.stock_actual}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Stock Mínimo */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Stock Mínimo"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleChange}
                helperText="Cuando el stock baja de este valor, se mostrará alerta"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Estante A-1, Bodega Principal"
              />
            </Grid>

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/inventario/productos')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

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

export default CrearProductoView