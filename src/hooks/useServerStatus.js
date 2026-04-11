import { useState, useEffect } from 'react'
import { dashboardService } from 'src/services/inventario/dashboard.service'

export const useServerStatus = () => {
  const [status, setStatus] = useState('online') // 🔥 Cambiar a online por defecto

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await dashboardService.testConnection()
        setStatus(result.online ? 'online' : 'offline')
      } catch (error) {
        console.error('Error checking status:', error)
        setStatus('online') // 🔥 Forzar online en caso de error
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return { status }
}