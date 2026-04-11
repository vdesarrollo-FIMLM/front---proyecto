import { useEffect } from 'react'
import { useRouter } from 'next/router'

const InventarioIndex = () => {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/inventario/dashboard')
  }, [router])
  
  return null
}

export default InventarioIndex