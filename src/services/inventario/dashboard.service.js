import api from '../api'
import { reservasService } from './reservas.service'

export const dashboardService = {
  async getStats() {
    try {
      console.log('🔵 Llamando a getStats...')
      const response = await api.get('/inventario/dashboard')
      const stats = response.data
      
      // Obtener productos bajo stock considerando stock disponible
      const productosBajoStock = await Promise.all(
        (stats.productos_bajo_stock || []).map(async (producto) => {
          const stockInfo = await reservasService.getStockDisponible(producto.codigo)
          return {
            ...producto,
            stock_actual: stockInfo.stock_disponible
          }
        })
      )
      
      return {
        ...stats,
        productos_bajo_stock: productosBajoStock
      }
    } catch (error) {
      console.error('Error en getStats:', error)
      return {
        total_productos: 0,
        productos_bajo_stock: [],
        ultimos_movimientos: []
      }
    }
  },
async testConnection() {
    try {
      console.log('🔵 Probando conexión...')
      const response = await api.get('/test')
      console.log('✅ Conexión exitosa:', response.data)
      return { online: true, data: response.data }
    } catch (error) {
      console.error('❌ Error en testConnection:', error)
      return { online: false, error: error.message }
    }
  }
}