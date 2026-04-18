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
  if (role === 'client') return '/inventario/movimientos'
  else if (modeMaintenance == 'true') return '/maintenance'
  else return '/inventario/movimientos'
}

const Home = () => {
  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // CAMBIAR: de '/inventario/dashboard' a '/inventario/movimientos'
    const homeRoute = '/inventario/movimientos'
    
    console.log('🔵 Redirigiendo a:', homeRoute)
    router.replace(homeRoute)
    
  }, [router])

  return <Spinner />
}

export default Home