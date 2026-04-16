// src/@core/layouts/components/shared-components/UserDropdown.js
import { useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

import { useTranslation } from 'react-i18next'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = props => {
  // ** Props
   const { settings = {} } = props
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()

  // ** Vars
  const { direction = 'ltr' } = settings

  // Función para obtener color según el rol
  const getRolColor = () => {
    switch (user?.rol) {
      case 'super_admin': return 'error'
      case 'admin': return 'warning'
      default: return 'info'
    }
  }

  // Función para obtener nombre del rol
  const getRolLabel = () => {
    switch (user?.rol) {
      case 'super_admin': return 'Super Administrador'
      case 'admin': return 'Administrador'
      default: return 'Operativo'
    }
  }

  // Obtener iniciales del usuario
  const getInitials = () => {
    const username = user?.username || 'U'
    return username.substring(0, 2).toUpperCase()
  }

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  // Si no hay usuario, no mostrar nada
  if (!user) return null

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}
        >
          {getInitials()}
        </Avatar>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 280, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar sx={{ width: '2.5rem', height: '2.5rem', bgcolor: 'secondary.main' }}>
                {getInitials()}
              </Avatar>
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{user?.username || 'Usuario'}</Typography>
              <Chip
                label={getRolLabel()}
                color={getRolColor()}
                size="small"
                sx={{ mt: 0.5, fontWeight: 'bold', fontSize: '0.7rem' }}
              />
              {user?.email && (
                <Typography variant='caption' sx={{ fontSize: '0.7rem', color: 'text.disabled', mt: 0.5 }}>
                  {user.email}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mt: '0 !important' }} />

        {/* Opción de perfil */}
        <MenuItem
          onClick={() => handleDropdownClose('/perfil')}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:account' />
          {t('Mi Perfil')}
        </MenuItem>

        {/* Administrar usuarios - solo super_admin */}
        {user?.rol === 'super_admin' && (
          <MenuItem
            onClick={() => handleDropdownClose('/inventario/usuarios')}
            sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
          >
            <Icon icon='mdi:account-group' />
            {t('Administrar Usuarios')}
          </MenuItem>
        )}

        <Divider />

        {/* Cerrar sesión */}
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'error.main' } }}
        >
          <Icon icon='mdi:logout-variant' />
          <Typography color='error.main'>{t('Cerrar sesión')}</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown