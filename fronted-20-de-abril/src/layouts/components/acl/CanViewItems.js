// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewItems = props => {
  // ** Props
  const { children, item } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability?.can(item?.action, item?.subject) ? <>{children}</> : null
}

export default CanViewItems
