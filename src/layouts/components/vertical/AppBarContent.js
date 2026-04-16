// src/layouts/components/vertical/AppBarContent.js
import { Box, Typography, Chip } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

const AppBarContent = props => {
  const { user } = useAuth()
  
  const getRolColor = () => {
    switch (user?.rol) {
      case 'super_admin': return 'error'
      case 'admin': return 'warning'
      default: return 'info'
    }
  }
  
  const getRolLabel = () => {
    switch (user?.rol) {
      case 'super_admin': return 'Super Admin'
      case 'admin': return 'Administrador'
      default: return 'Operativo'
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Chip 
        label={getRolLabel()} 
        color={getRolColor()} 
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
      <Typography variant="body2">
        {user?.username}
      </Typography>
    </Box>
  )
}

export default AppBarContent