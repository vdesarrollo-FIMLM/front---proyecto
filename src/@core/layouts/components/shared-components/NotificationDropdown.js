// ** React Imports
import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { useTranslation } from 'react-i18next'

// ** Next Import
import { useRouter } from 'next/router'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
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

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'normal',
  lineHeight: '1.2',
  textOverflow: 'ellipsis'
})

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 549
})

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = props => {
  // ** Props
  const { settings, notificaciones, setNotificaciones } = props
  const { t } = useTranslation()
  const router = useRouter()

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleClickNotificacion = notificacion => {
    const notificacionIndex = notificaciones.findIndex(item => item.id === notificacion.id)

    if (notificacionIndex !== -1) {
      const updatedNotificaciones = [...notificaciones]
      updatedNotificaciones[notificacionIndex] = {
        ...notificacion,
        estado: 'selected'
      }

      setNotificaciones(updatedNotificaciones)
      setAnchorEl(null)
      router.replace(`/${notificacion.redirect}`)
    }
  }

  const nuevasNotificaciones = notificaciones.filter(notificacion => notificacion.estado !== 'selected')

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        {nuevasNotificaciones != 0 ? (
          <Badge
            color='error'
            variant='dot'
            invisible={!notificaciones.length}
            sx={{
              ' a': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
            }}
          >
            <Icon icon='line-md:bell-twotone-loop' />
          </Badge>
        ) : (
          <Icon icon='line-md:bell-twotone-loop' />
        )}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Nuevas Funcionalidades</Typography>
            {nuevasNotificaciones.length > 0 && (
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label={`${nuevasNotificaciones.length} ${nuevasNotificaciones.length > 1 ? 'Nuevas' : 'Nueva'}`}
                sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
              />
            )}
          </Box>
        </MenuItem>
        <ScrollWrapper>
          {notificaciones
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .map((notification, index) => (
              <MenuItem
                key={index}
                onClick={() => handleClickNotificacion(notification)}
                sx={{
                  backgroundColor: notification.estado === 'selected' ? 'transparent' : 'rgba(144, 238, 144, 0.15)',
                  transition: 'background-color 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mx: 4, flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <MenuItemTitle>{t(notification.titulo)}</MenuItemTitle>
                      <Typography variant='caption' sx={{ marginLeft: 'auto' }}>
                        {notification.fecha}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <MenuItemSubtitle variant='body2'>{notification.subtitulo}</MenuItemSubtitle>
                    </Box>
                  </Box>
                </Box>
              </MenuItem>
            ))}
        </ScrollWrapper>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
