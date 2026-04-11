// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

const modeMaintenance = process.env.NEXT_PUBLIC_MODE_MAINTENANCE

export const getHomeRoute = role => {
  // 🔥 MODIFICADO: Redirigir al dashboard de inventario
  if (role === 'client') return '/inventario/dashboard'
  else if (modeMaintenance == 'true') return '/maintenance'
  else return '/inventario/dashboard'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // 🔥 MODIFICADO: Redirigir al dashboard de inventario
    // Si hay usuario autenticado o no, siempre ir a inventario
    const homeRoute = '/inventario/dashboard'
    
    console.log('🔵 Redirigiendo a:', homeRoute)
    router.replace(homeRoute)
    
    /* CÓDIGO ORIGINAL COMENTADO
    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role)

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home