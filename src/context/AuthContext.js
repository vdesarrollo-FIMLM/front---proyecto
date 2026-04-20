// src/context/AuthContext.js
import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from 'src/configs/axios'

// ✅ Exportación nombrada de AuthContext
export const AuthContext = createContext()

// ✅ Exportación nombrada de AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('accessToken')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      
      const { access_token, user: userData } = response.data
      localStorage.setItem('accessToken', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(userData)
      
      // Redirigir según el rol
      if (userData.rol === 'super_admin') {
        router.push('/inventario/movimientos')
      } else if (userData.rol === 'admin') {
        router.push('/inventario/movimientos')
      } else {
        router.push('/inventario/entrada')
      }
    
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error de autenticación'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/login')
  }

  const hasPermission = (permission) => {
    if (!user) return false
    
    const permissions = {
      super_admin: ['create_product', 'delete_product', 'edit_product', 'confirm_entries', 'confirm_exits', 'view_movements', 'view_dashboard', 'manage_users', 'view_products'],
      admin: ['view_movements', 'view_dashboard'],
      operativo: ['create_entry', 'create_exit']
    }
    
    return permissions[user.rol]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}