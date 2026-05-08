import api from '../api'

export const entradasService = {
  async registrarEntrada(data) {
    try {
      console.log('🔵 API: POST /movimientos/')
      console.log('📦 Datos:', JSON.stringify(data, null, 2))
      const response = await api.post('/movimientos/', data)
      console.log('✅ Respuesta:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error en registrarEntrada:')
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      console.error('Headers enviados:', error.config?.headers)
      throw error
    }
  },

  async registrarEntradaMultiple(data) {
    try {
      console.log('🔵 API: POST /movimientos/entrada-multiple')
      console.log('📦 Datos completos:', JSON.stringify(data, null, 2))
      console.log('📦 Tipo de datos:', typeof data)
      console.log('📦 productos:', data.productos)
      
      const response = await api.post('/movimientos/entrada-multiple', data)
      console.log('✅ Respuesta:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error en registrarEntradaMultiple:')
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      console.error('Datos que se intentaron enviar:', data)
      throw error
    }
  },

  // Obtener últimas entradas para historial
  async getUltimasEntradas(limit = 10) {
    try {
      const response = await api.get('/movimientos/')
      const movimientos = response.data || []
      return movimientos
        .filter(m => m.tipo === 'entrada')
        .slice(0, limit)
    } catch (error) {
      console.error('Error obteniendo últimas entradas:', error)
      return []
    }
  },

  // Buscar producto por código o nombre
  // services/inventario/entradas.service.js
async buscarProducto(query) {
  try {
    console.log('🔍 Buscando producto con query:', query)
    const response = await api.get(`/productos/buscar?q=${encodeURIComponent(query)}`)
    console.log('📦 Datos recibidos del backend:', response.data)
    
    // Verificar que cada producto tenga los campos necesarios
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((p, idx) => {
        console.log(`Producto ${idx + 1}:`, {
          id: p.id || p._id,
          codigo: p.codigo,
          nombre: p.nombre,
          stock_actual: p.stock_actual
        })
        
        // Si no tiene el campo 'codigo', intentar obtenerlo de otra forma
        if (!p.codigo && p._id) {
          console.warn(`⚠️ Producto ${p.nombre} no tiene campo 'codigo'`)
        }
      })
    }
    
    return response.data
  } catch (error) {
    console.error('Error buscando producto:', error)
    return []
  }
},

  // Obtener producto por ID
  async getProductoById(id) {
    try {
      const response = await api.get(`/productos/${id}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      return null
    }
  }
}