// src/services/inventario/productos.service.js
import api from '../api'
import { reservasService } from './reservas.service'

export const productosService = {
  async getAll() {
    try {
      console.log('🔵 Llamando a GET /productos/')
      const response = await api.get('/productos/')
      const productos = response.data
      
      // Para cada producto, obtener el stock disponible
      const productosConStock = await Promise.all(
        productos.map(async (producto) => {
          try {
            const stockInfo = await reservasService.getStockDisponible(producto.codigo)
            return {
              ...producto,
              stock_actual: stockInfo.stock_disponible,
              stock_fisico: stockInfo.stock_fisico,
              stock_reservado_otros: stockInfo.stock_reservado_otros,
              stock_reservado_actual: stockInfo.stock_reservado_actual
            }
          } catch (error) {
            console.error(`Error con producto ${producto.codigo}:`, error)
            return producto
          }
        })
      )
      
      return productosConStock
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      return []
    }
  },

  async getById(id) {
    try {
      console.log(`🔵 Llamando a GET /productos/${id}`)
      const response = await api.get(`/productos/${id}`)
      const producto = response.data
      
      if (producto && producto.codigo) {
        try {
          const stockInfo = await reservasService.getStockDisponible(producto.codigo)
          return {
            ...producto,
            stock_actual: stockInfo.stock_disponible,
            stock_fisico: stockInfo.stock_fisico,
            stock_reservado_otros: stockInfo.stock_reservado_otros,
            stock_reservado_actual: stockInfo.stock_reservado_actual
          }
        } catch (error) {
          return producto
        }
      }
      return producto
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      return null
    }
  },

  async buscarProducto(termino) {
    try {
      const response = await api.get(`/productos/buscar?q=${encodeURIComponent(termino)}`)
      const productos = response.data
      
      const productosConStock = await Promise.all(
        productos.map(async (producto) => {
          try {
            const stockInfo = await reservasService.getStockDisponible(producto.codigo)
            return {
              ...producto,
              stock_actual: stockInfo.stock_disponible,
              stock_fisico: stockInfo.stock_fisico
            }
          } catch (error) {
            return producto
          }
        })
      )
      
      return productosConStock
    } catch (error) {
      console.error('Error buscando producto:', error)
      return []
    }
  },

  async create(data) {
    try {
      const response = await api.post('/productos/', data)
      reservasService.clearCache()
      return response.data
    } catch (error) {
      console.error('Error creando producto:', error)
      throw error
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/productos/${id}`, data)
      reservasService.clearCache()
      return response.data
    } catch (error) {
      console.error('Error actualizando producto:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/productos/${id}`)
      reservasService.clearCache()
      return response.data
    } catch (error) {
      console.error('Error eliminando producto:', error)
      throw error
    }
  },

  async generarQR(id) {
    try {
      const response = await api.get(`/productos/${id}/qr-code`)
      return response.data
    } catch (error) {
      console.error('Error generando QR:', error)
      throw error
    }
  }
}