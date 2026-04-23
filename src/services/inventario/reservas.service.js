// src/services/inventario/reservas.service.js
import api from '../api'

export const getSessionId = () => {
  let sessionId = localStorage.getItem('inventario_session_id')
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('inventario_session_id', sessionId)
  }
  return sessionId
}

// Cache para stock disponible (evitar muchas peticiones)
const stockCache = new Map()
const CACHE_TTL = 5000 // 5 segundos

export const reservasService = {
  async guardarReserva(items, datosAdicionales = {}) {
    try {
      const sessionId = getSessionId()
      const response = await api.post(
        `/movimientos/reservas/guardar?session_id=${sessionId}`,
        { items, datos_adicionales: datosAdicionales }
      )
      // Limpiar cache después de guardar
      stockCache.clear()
      return response.data
    } catch (error) {
      console.error('Error guardando reserva:', error)
      throw error
    }
  },

  async obtenerReserva() {
    try {
      const sessionId = getSessionId()
      const response = await api.get('/movimientos/reservas/obtener', {
        params: { session_id: sessionId }
      })
      return response.data.reserva
    } catch (error) {
      console.error('Error obteniendo reserva:', error)
      return null
    }
  },

  async eliminarReserva() {
  try {
    const sessionId = getSessionId()
    console.log(`🔵 Eliminando reserva: ${sessionId}`)
    const response = await api.delete('/movimientos/reservas/eliminar', {
      params: { session_id: sessionId }
    })
    console.log('✅ Respuesta:', response.data)
    stockCache.clear()
    return response.data
  } catch (error) {
    console.error('Error eliminando reserva:', error)
    throw error
  }
},

  async confirmarReserva() {
    try {
      const sessionId = getSessionId()
      const response = await api.post('/movimientos/reservas/confirmar', null, {
        params: { session_id: sessionId }
      })
      stockCache.clear()
      return response.data
    } catch (error) {
      console.error('Error confirmando reserva:', error)
      throw error
    }
  },

  async getStockDisponible(productoId, forceRefresh = false) {
  try {
    const sessionId = getSessionId()
    console.log(`🔵 Obteniendo stock disponible para ${productoId}`)
    
    const response = await api.get(`/movimientos/reservas/stock-disponible/${productoId}`, {
      params: { session_id: sessionId }
    })
    
    console.log(`✅ Stock para ${productoId}:`, response.data)
    return response.data
  } catch (error) {
    console.error('Error obteniendo stock disponible:', error)
    return {
      stock_fisico: 0,
      stock_disponible: 0,
      stock_reservado_otros: 0,
      stock_reservado_actual: 0
    }
  }
},

  // Limpiar cache manualmente
  clearCache() {
    stockCache.clear()
  },
// src/services/inventario/reservas.service.js
async ajustarReserva(ajustes, datosAdicionales = {}) {
  try {
    const sessionId = getSessionId()
    console.log('🔵 Ajustando reserva:', { sessionId, ajustes, datosAdicionales })
    
    const response = await api.post(
      `/movimientos/reservas/ajustar?session_id=${sessionId}`,
      { ajustes, datos_adicionales: datosAdicionales }
    )
    return response.data
  } catch (error) {
    console.error('Error ajustando reserva:', error)
    throw error
  }
}
}