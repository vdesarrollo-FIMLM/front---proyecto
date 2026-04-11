import api from '../api'

export const excelService = {
  // Subir archivo Excel/CSV
  async cargarExcel(file) {
    try {
      const formData = new FormData()
      formData.append('archivo', file)
      
      const response = await api.post('/productos/cargar-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (this.onProgress) this.onProgress(percentCompleted)
        }
      })
      return response.data
    } catch (error) {
      console.error('Error cargando archivo Excel:', error)
      throw error
    }
  },

  // Descargar plantilla de ejemplo
  async descargarPlantilla() {
    try {
      const response = await api.get('/productos/plantilla-excel', {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error descargando plantilla:', error)
      throw error
    }
  },

  // Validar archivo antes de subir
  validarArchivo(file) {
    const tiposPermitidos = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ]
    
    const extensionesPermitidas = ['.xlsx', '.xls', '.csv']
    const extension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!tiposPermitidos.includes(file.type) && !extensionesPermitidas.includes(extension)) {
      return { valido: false, error: 'Formato no soportado. Use .xlsx, .xls o .csv' }
    }
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { valido: false, error: 'Archivo demasiado grande. Máximo 10MB' }
    }
    
    return { valido: true, error: null }
  }
}