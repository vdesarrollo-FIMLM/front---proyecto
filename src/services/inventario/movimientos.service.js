// src/services/inventario/movimientos.service.js
import api from '../api'

export const movimientosService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.limit) params.append('limit', filters.limit)
      if (filters.tipo) params.append('tipo', filters.tipo)
      if (filters.producto_id) params.append('producto_id', filters.producto_id)
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde)
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta)
      if (filters.motivo) params.append('motivo', filters.motivo)
      
      const query = params.toString()
      const url = query ? `/movimientos/?${query}` : '/movimientos/'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo movimientos:', error)
      return []
    }
  },

  async getProductos() {
    try {
      const response = await api.get('/productos/')
      return response.data
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      return []
    }
  },

  async getEstadisticas(movimientos) {
    const entradas = movimientos.filter(m => m.tipo === 'entrada')
    const salidas = movimientos.filter(m => m.tipo === 'salida')
    
    return {
      totalEntradas: entradas.length,
      totalSalidas: salidas.length,
      totalUnidadesEntrada: entradas.reduce((sum, m) => sum + (m.cantidad || 0), 0),
      totalUnidadesSalida: salidas.reduce((sum, m) => sum + (m.cantidad || 0), 0),
      balanceNeto: entradas.reduce((sum, m) => sum + (m.cantidad || 0), 0) - 
                   salidas.reduce((sum, m) => sum + (m.cantidad || 0), 0)
    }
  },

  async revertirMovimiento(movimiento) {
    try {
      // Para revertir, crear movimiento contrario con el mismo producto_id (código)
      const movimientoContrario = {
        producto_id: movimiento.producto_id, // Ya es el código del producto
        tipo: movimiento.tipo === 'entrada' ? 'salida' : 'entrada',
        cantidad: movimiento.cantidad,
        motivo: `Reversión de ${movimiento.tipo}`,
        notas: `Revertido: ${movimiento.motivo || 'Sin motivo'}`,
        usuario: 'admin'
      }
      
      const response = await api.post('/movimientos/', movimientoContrario)
      return response.data
    } catch (error) {
      console.error('Error revirtiendo movimiento:', error)
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
      // Este endpoint puede no existir en tu backend, lo dejamos opcional
      // Por ahora retornamos que no tiene PDF
      return { tiene_pdf: false }
    } catch (error) {
      return { tiene_pdf: false }
    }
  },

  async generarComprobante(movimientoId) {
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

  async exportarExcel(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.fecha_desde) params.append('fecha_inicio', filters.fecha_desde)
      if (filters.fecha_hasta) params.append('fecha_fin', filters.fecha_hasta)
      if (filters.tipo) params.append('tipo', filters.tipo)
      
      const query = params.toString()
      const url = query ? `/movimientos/exportar/excel?${query}` : '/movimientos/exportar/excel'
      
      const response = await api.get(url, { responseType: 'blob' })
      return response.data
    } catch (error) {
      console.error('Error exportando a Excel:', error)
      throw error
    }
  },

  getDatosGraficos(movimientos) {
    // Movimientos por día (últimos 7 días)
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()
    
    const movimientosPorDia = ultimos7Dias.map(fecha => {
      return movimientos.filter(m => 
        new Date(m.fecha_movimiento).toISOString().split('T')[0] === fecha
      ).length
    })
    
    // Distribución por motivo (top 5)
    const motivos = {}
    movimientos.forEach(m => {
      const motivo = m.motivo || 'Sin motivo'
      motivos[motivo] = (motivos[motivo] || 0) + 1
    })
    
    const topMotivos = Object.entries(motivos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    // Top 10 productos
    const productosCount = {}
    movimientos.forEach(m => {
      if (m.producto_nombre) {
        productosCount[m.producto_nombre] = (productosCount[m.producto_nombre] || 0) + (m.cantidad || 0)
      } else if (m.producto_id) {
        productosCount[`Producto ${m.producto_id}`] = (productosCount[`Producto ${m.producto_id}`] || 0) + (m.cantidad || 0)
      }
    })
    
    const topProductos = Object.entries(productosCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    // Actividad por hora
    const horas = Array.from({ length: 24 }, (_, i) => i)
    const actividadPorHora = horas.map(hora => {
      return movimientos.filter(m => {
        const fecha = new Date(m.fecha_movimiento)
        return fecha.getHours() === hora
      }).length
    })
    
    return {
      movimientosPorDia: { labels: ultimos7Dias.map(f => f.split('-').slice(1).join('/')), data: movimientosPorDia },
      topMotivos: { labels: topMotivos.map(m => m[0]), data: topMotivos.map(m => m[1]) },
      topProductos: { labels: topProductos.map(p => p[0]), data: topProductos.map(p => p[1]) },
      actividadPorHora: { labels: horas.map(h => `${h}:00`), data: actividadPorHora }
    }
  }
}