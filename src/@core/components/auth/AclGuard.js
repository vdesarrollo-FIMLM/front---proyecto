// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/configs/acl'

// ** Component Imports
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

const AclGuard = props => {
  const { children, aclAbilities, guestGuard } = props
  const auth = useAuth()

  // 🔥 TEMPORAL: Desactivar ACL - Siempre mostrar contenido
  return <>{children}</>

  /* CÓDIGO ORIGINAL COMENTADO
  if (guestGuard) {
    return <>{children}</>
  }

  if (auth.loading) {
    return <Spinner />
  }

  if (!auth.user) {
    return <>{children}</>
  }

  const ability = useContext(AbilityContext)
  const canAccess = ability.can(aclAbilities.action, aclAbilities.subject)

  if (canAccess) {
    return <>{children}</>
  }

  return <NotAuthorized />
  */
}

export default AclGuard