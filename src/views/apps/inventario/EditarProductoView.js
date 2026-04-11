import { useState, useEffect } from 'react'
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

const EditarProductoView = () => {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    if (id) {
      cargarProducto()
    }
  }, [id])

  const cargarProducto = async () => {
    setLoading(true)
    try {
      const producto = await productosService.getById(id)
      if (producto) {
        setFormData({
          codigo: producto.codigo || '',
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          categoria: producto.categoria || 'General',
          precio_unitario: producto.precio_unitario || 0,
          stock_actual: producto.stock_actual || 0,
          stock_minimo: producto.stock_minimo || 5,
          ubicacion: producto.ubicacion || ''
        })
      } else {
        setSnackbar({ open: true, message: 'Producto no encontrado', severity: 'error' })
        setTimeout(() => router.push('/inventario/productos'), 1500)
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al cargar producto', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)
    
    try {
      await productosService.update(id, formData)
      setSnackbar({ open: true, message: 'Producto actualizado exitosamente', severity: 'success' })
      
      setTimeout(() => {
        router.push('/inventario/productos')
      }, 1500)
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || 'Error al actualizar producto', 
        severity: 'error' 
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
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
          Editar Producto
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
                disabled
                helperText="El código no puede ser modificado"
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
              />
            </Grid>

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/inventario/productos')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
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

export default EditarProductoView