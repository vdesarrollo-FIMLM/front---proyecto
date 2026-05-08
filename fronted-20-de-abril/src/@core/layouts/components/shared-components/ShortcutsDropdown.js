// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import CanViewItems from 'src/layouts/components/acl/CanViewItems'
import CanViewConfiguration from 'src/layouts/components/acl/CanViewConfiguration'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 350,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: '30rem'
})

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const shortcuts = [
  {
    title: 'Parametros',
    url: '/apps/parametros/crear',
    icon: 'carbon:parameter',
    action: 'parametros-crear'
  },
  {
    title: 'Usuarios',
    url: '/apps/usuarios/listar',
    icon: 'fa:users',
    action: 'usuarios-listar'
  },
  {
    title: 'Etiquetas',
    url: '/apps/etiquetas',
    icon: 'mdi:tag',
    action: 'etiquetas-listar'
  },
  {
    title: 'Zonas',
    url: '/apps/zonas',
    icon: 'solar:point-on-map-bold-duotone',
    action: 'zonas-listar'
  },
  {
    title: 'Roles',
    url: '/apps/roles',
    icon: 'fa-solid:user-tag',
    action: 'roles-listar'
  }
]

const ShortcutsDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  return (
    <CanViewConfiguration permiso={'home-configuraciones-ver'}>
      <Fragment>
        <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
          <Icon icon='mdi:view-grid-outline' />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDropdownClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        >
          <MenuItem
            disableRipple
            disableTouchRipple
            sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Icon icon='mdi:gear' />
              <Typography sx={{ ml: 3, fontSize: '1.125rem', color: 'text.secondary', fontWeight: 600 }}>
                Configuración
              </Typography>
            </Box>
          </MenuItem>
          <Divider sx={{ my: '0 !important' }} />
          <ScrollWrapper hidden={hidden}>
            <Grid
              container
              spacing={0}
              sx={{
                '& .MuiGrid-root': {
                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  '&:nth-of-type(odd)': { borderRight: theme => `1px solid ${theme.palette.divider}` }
                }
              }}
            >
              {shortcuts.map(shortcut => {
                return (
                  <CanViewItems key={shortcut.title} item={shortcut}>
                    <Grid
                      item
                      xs={6}
                      onClick={handleDropdownClose}
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <Box
                        component={Link}
                        href={shortcut.url}
                        sx={{
                          p: 6,
                          display: 'flex',
                          textAlign: 'center',
                          alignItems: 'center',
                          textDecoration: 'none',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}
                      >
                        <CustomAvatar skin='light' color='secondary' sx={{ mb: 2, width: 50, height: 50 }}>
                          <Icon icon={shortcut.icon} />
                        </CustomAvatar>
                        <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{shortcut.title}</Typography>
                        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                          {shortcut.subtitle}
                        </Typography>
                      </Box>
                    </Grid>
                  </CanViewItems>
                )
              })}
            </Grid>
          </ScrollWrapper>
        </Menu>
      </Fragment>
    </CanViewConfiguration>
  )
}

export default ShortcutsDropdown
