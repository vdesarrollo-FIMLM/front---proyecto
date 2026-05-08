import { useState, useEffect } from 'react'
import { dashboardService } from 'src/services/inventario/dashboard.service'
import { useAuth } from 'src/hooks/useAuth'

const DashboardView = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🟢 DashboardView montado - Cargando datos...')
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🟢 Llamando a dashboardService.getStats()...')
      const data = await dashboardService.getStats()
      console.log('🟢 Datos recibidos:', data)
      setStats(data)
    } catch (err) {
      console.error('❌ Error cargando datos:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Cargando Dashboard...</h2>
        <p>Conectando con el backend...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={cargarDatos}>Reintentar</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📊 Dashboard de Inventario</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ 
          padding: '1.5rem', 
          background: '#f0f9ff', 
          borderRadius: '1rem',
          flex: 1,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '3rem', margin: 0, color: '#2563eb' }}>
            {stats?.total_productos || 0}
          </h2>
          <p>Productos Totales</p>
        </div>
        
        <div style={{ 
          padding: '1.5rem', 
          background: '#fef3c7', 
          borderRadius: '1rem',
          flex: 1,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '3rem', margin: 0, color: '#d97706' }}>
            {stats?.productos_bajo_stock || 0}
          </h2>
          <p>Bajo Stock</p>
        </div>
      </div>
      
      <button 
        onClick={cargarDatos}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Actualizar Datos
      </button>
    </div>
  )
}

export default DashboardView