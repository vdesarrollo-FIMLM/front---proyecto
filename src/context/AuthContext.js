// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Cookies
import Cookies from 'js-cookie'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean
}
const AuthContext = createContext(defaultProvider)

const modeMaintenance = process.env.NEXT_PUBLIC_MODE_MAINTENANCE

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    setUser({
      id: '1',
      id_persona: '1',
      fullname: 'John Doe',
      username: 'John Doe',
      nombre: 'Super',
      role: ['all'],
      permissions: ['home-ver'],
      acepta_terminos: true,
      idioma: 'es'
    })
    setLoading(false)
    router.push('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const values = {
    user,
    loading,
    setUser,
    setLoading
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
