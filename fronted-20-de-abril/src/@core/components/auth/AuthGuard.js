// src/@core/components/auth/AuthGuard.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si no está autenticado y no está cargando
    if (!auth.loading && !auth.user) {
      const returnUrl = router.asPath
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
    }
  }, [auth.loading, auth.user, router])

  // Mostrar fallback mientras carga
  if (auth.loading) {
    return fallback || <div>Cargando...</div>
  }

  // Si no está autenticado, no mostrar nada
  if (!auth.user) {
    return null
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
}

export default AuthGuard