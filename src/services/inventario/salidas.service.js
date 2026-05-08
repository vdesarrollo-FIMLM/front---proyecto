// src/services/inventario/salidas.service.js
import api from '../api'

export const salidasService = {
  async registrarSalida(data) {
    try {
      const response = await api.post('/movimientos/', data)
      return response.data
    } catch (error) {
      console.error('Error registrando salida:', error)
      throw error
    }
  },

  async registrarSalidaMultiple(data) {
    try {
      const response = await api.post('/movimientos/salida-multiple', data)
      return response.data
    } catch (error) {
      console.error('Error registrando salida múltiple:', error)
      throw error
    }
  },

  async getUltimasSalidas(limit = 10) {
    try {
      const response = await api.get(`/movimientos/?limit=${limit}&tipo=salida`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo últimas salidas:', error)
      return []
    }
  },

  async buscarProducto(termino) {
    try {
      const response = await api.get(`/productos/buscar?q=${encodeURIComponent(termino)}`)
      return response.data
    } catch (error) {
      console.error('Error buscando producto:', error)
      return []
    }
  },

  async generarComprobanteSalida(movimientoId) {
    try {
      const response = await api.get(`/movimientos/salida/${movimientoId}/pdf`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error generando comprobante:', error)
      throw error
    }
  },
  async generarComprobanteMultiple(salidas) {
  try {
    const response = await api.post('/movimientos/comprobante-multiple', { salidas }, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    console.error('Error generando comprobante múltiple:', error)
    throw error
  }
},
  async subirPDFFirmado(movimientoId, file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post(`/movimientos/${movimientoId}/subir-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      console.error('Error subiendo PDF:', error)
      throw error
    }
  },

  async getPDFInfo(movimientoId) {
    try {
      const response = await api.get(`/movimientos/${movimientoId}/pdf-info`)
      return response.data
    } catch (error) {
      return { tiene_pdf: false }
    }
  }
}