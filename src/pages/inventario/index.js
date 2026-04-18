import { useEffect } from 'react'
import { useRouter } from 'next/router'

const InventarioIndex = () => {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/inventario/movimientos')
  }, [router])
  
  return null
}

export default InventarioIndex