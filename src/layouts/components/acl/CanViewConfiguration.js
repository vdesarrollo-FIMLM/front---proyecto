// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewConfiguration = props => {
  // ** Props
  const { children, permiso } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && ability.can(permiso) ? <>{children}</> : null
}

export default CanViewConfiguration
