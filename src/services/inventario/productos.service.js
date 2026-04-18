// src/services/inventario/productos.service.js
import api from '../api'
import { reservasService } from './reservas.service'

export const productosService = {
  async getAll() {
  try {
    console.log('🔵 Llamando a GET /productos/')
    const response = await api.get('/productos/')
    const productos = response.data
    
    console.log('📦 Productos del backend:', productos.map(p => ({ 
      codigo: p.codigo, 
      stock_actual: p.stock_actual,
      stock_total: p.stock_total 
    })))
    
    // Para cada producto, obtener el stock disponible (considerando reservas)
    const productosConStock = await Promise.all(
      productos.map(async (producto) => {
        try {
          const stockInfo = await reservasService.getStockDisponible(producto.codigo)
          console.log(`📊 ${producto.codigo} - ${producto.nombre}:`, {
            stock_actual_backend: producto.stock_actual,
            stock_disponible_backend: stockInfo.stock_disponible
          })
          
          return {
            ...producto,
            stock_actual: stockInfo.stock_disponible !== undefined ? stockInfo.stock_disponible : producto.stock_actual,
            stock_fisico: stockInfo.stock_fisico || producto.stock_actual,
            stock_reservado_otros: stockInfo.stock_reservado_otros || 0,
            stock_reservado_actual: stockInfo.stock_reservado_actual || 0
          }
        } catch (error) {
          console.error(`Error con producto ${producto.codigo}:`, error)
          return producto
        }
      })
    )
    
    console.log('📦 Productos finales:', productosConStock.map(p => ({ 
      codigo: p.codigo, 
      stock_actual: p.stock_actual 
    })))
    
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
  },

async getProductoConUbicaciones(codigo) {
  try {
    console.log(`🔵 Llamando a GET /productos/${codigo}/con-ubicaciones`)
    const response = await api.get(`/productos/${codigo}/con-ubicaciones`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo producto con ubicaciones:', error)
    return {
      producto: null,
      ubicaciones: [],
      stock_por_ubicacion: [],
      total_ubicaciones: 0
    }
  }
},

async transferirStock(productoId, origen, destino, cantidad) {
  try {
    const response = await api.post(`/productos/${productoId}/transferir`, null, {
      params: { origen, destino, cantidad }
    })
    return response.data
  } catch (error) {
    console.error('Error transfiriendo stock:', error)
    throw error
  }
},


async crearUbicacion(productoId, ubicacion, cantidad = 0) {
  try {
    const response = await api.post(`/productos/${productoId}/ubicaciones`, null, {
      params: { ubicacion, cantidad }
    })
    return response.data
  } catch (error) {
    console.error('Error creando ubicación:', error)
    throw error
  }
},

async actualizarUbicacion(productoId, ubicacion, cantidad) {
  try {
    const response = await api.put(`/productos/${productoId}/ubicaciones/${encodeURIComponent(ubicacion)}`, null, {
      params: { cantidad }
    })
    return response.data
  } catch (error) {
    console.error('Error actualizando ubicación:', error)
    throw error
  }
},

async eliminarUbicacion(productoId, ubicacion) {
  try {
    const response = await api.delete(`/productos/${productoId}/ubicaciones/${encodeURIComponent(ubicacion)}`)
    return response.data
  } catch (error) {
    console.error('Error eliminando ubicación:', error)
    throw error
  }
}
}