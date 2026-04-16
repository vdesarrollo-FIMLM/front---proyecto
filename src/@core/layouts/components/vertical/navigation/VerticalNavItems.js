// src/@core/layouts/components/vertical/navigation/VerticalNavItems.js
import React from 'react'
import Box from '@mui/material/Box'
import { useAuth } from 'src/hooks/useAuth'
import getNavigation from 'src/navigation/vertical'
import VerticalNavLink from './VerticalNavLink'
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'

const VerticalNavItems = props => {
  const { user } = useAuth()
  
  // Si no hay usuario, no mostrar nada
  if (!user) return null
  
  // Obtener navegación filtrada por rol
  const navigation = getNavigation(user.rol)
  
  const RenderMenuItems = navigation?.map((item, index) => {
    const TagName = item.children ? VerticalNavGroup : VerticalNavLink
    
    return <TagName key={index} item={item} {...props} />
  })

  return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>{RenderMenuItems}</Box>
}

export default VerticalNavItems