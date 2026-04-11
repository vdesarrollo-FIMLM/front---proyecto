import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

export const useAuth = () => {
  // 🔥 TEMPORAL: Simular usuario autenticado para evitar redirecciones
  return {
    user: { name: 'Usuario Test', role: 'admin' },
    loading: false
  }
  
  // Código original comentado
  // return useContext(AuthContext)
}