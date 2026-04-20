import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Grid,
  TextField,
  Divider
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  QrCode as QrCodeIcon,
  Print as PrintIcon
} from '@mui/icons-material'

const ProductoResultCard = ({ producto, tipoOperacion, onConfirmar, onCancelar }) => {
  const isEntrada = tipoOperacion === 'entrada'
  const isSalida = tipoOperacion === 'salida'
  const isConsulta = tipoOperacion === 'consulta'
  
  const stockBajo = producto.stock_actual <= (producto.stock_minimo || 5)
  const stockCritico = producto.stock_actual === 0
  
  const handleConfirmar = () => {
    const cantidad = document.getElementById('cantidad-producto')?.value || 1
    onConfirmar(parseInt(cantidad))
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        {/* Header con estado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {stockCritico ? (
              <Chip 
                icon={<WarningIcon />} 
                label="Sin Stock" 
                color="error" 
                size="small"
              />
            ) : stockBajo ? (
              <Chip 
                icon={<WarningIcon />} 
                label="Stock Bajo" 
                color="warning" 
                size="small"
              />
            ) : (
              <Chip 
                icon={<CheckIcon />} 
                label="Stock OK" 
                color="success" 
                size="small"
              />
            )}
            <Chip 
              label={producto.codigo} 
              variant="outlined" 
              size="small"
              sx={{ fontFamily: 'monospace' }}
            />
          </Box>
          {producto.precio_unitario > 0 && (
            <Typography variant="h6" color="primary.main">
              ${producto.precio_unitario.toFixed(2)}
            </Typography>
          )}
        </Box>
        
        {/* Nombre y descripción */}
        <Typography variant="h6" gutterBottom>
          {producto.nombre}
        </Typography>
        {producto.descripcion && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {producto.descripcion}
          </Typography>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        {/* Detalles del producto */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Stock Actual
            </Typography>
            <Typography 
              variant="body1" 
              fontWeight="bold"
              color={stockBajo ? 'error.main' : 'success.main'}
            >
              {producto.stock_actual} unidades
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Stock Mínimo
            </Typography>
            <Typography variant="body1">
              {producto.stock_minimo || 5} unidades
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Categoría
            </Typography>
            <Typography variant="body2">
              {producto.categoria || 'Sin categoría'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Ubicación
            </Typography>
            <Typography variant="body2">
              {producto.ubicacion || 'No especificada'}
            </Typography>
          </Grid>
        </Grid>
        
        {/* Formulario de cantidad (solo para entrada/salida) */}
        {(isEntrada || isSalida) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cantidad a {isEntrada ? 'ingresar' : 'retirar'}:
              </Typography>
              <TextField
                id="cantidad-producto"
                type="number"
                defaultValue={1}
                inputProps={{ min: 1, max: isSalida ? producto.stock_actual : undefined }}
                fullWidth
                size="small"
                helperText={isSalida && `Máximo disponible: ${producto.stock_actual} unidades`}
                error={isSalida && 1 > producto.stock_actual}
              />
            </Box>
          </>
        )}
        
        {/* Acciones */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
          {isConsulta && (
            <Button
              variant="outlined"
              startIcon={<QrCodeIcon />}
              onClick={() => window.open(`/api/productos/${producto.id}/qr-code`, '_blank')}
            >
              Ver QR
            </Button>
          )}
          {isConsulta && producto.precio_unitario > 0 && (
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Imprimir
            </Button>
          )}
          {(isEntrada || isSalida) && (
            <>
              <Button variant="outlined" onClick={onCancelar}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color={isEntrada ? 'success' : 'warning'}
                startIcon={isEntrada ? <ArrowDownIcon /> : <ArrowUpIcon />}
                onClick={handleConfirmar}
                disabled={isSalida && 1 > producto.stock_actual}
              >
                Confirmar {isEntrada ? 'Entrada' : 'Salida'}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductoResultCard