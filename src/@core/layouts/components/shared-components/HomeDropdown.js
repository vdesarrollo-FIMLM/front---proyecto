import { useState } from 'react'

import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'

// ** Next Import
import { useRouter } from 'next/router'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Third Party Components
import CanViewItems from 'src/layouts/components/acl/CanViewItems'

const HomeDropdown = ({ settings }) => {
  // ** Hook
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()

  // ** Vars
  const { layout, themeColor } = settings

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = e => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // ** Hooks
  const { saveSettings } = useSettings()

  const homes = [
    {
      titulo: 'Inicio',
      icono: 'iconamoon:home-duotone',
      color: 'fimlmstyle',
      action: 'home-ver',
      route: '/home'
    }
  ]

  const handleRouteChange = route => {
    setAnchorEl(null)
    router.push(route)

    const routeConfig = {
      '/home': { themeColor: 'fimlmstyle' }
    }

    const newSettings = routeConfig[route]
    if (newSettings) {
      saveSettings({ ...settings, ...newSettings })
    }
  }

  return (
    <div>
      <IconButton
        onClick={handleClick}
        sx={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      >
        <Icon
          color={
            themeColor == 'fimlmstyle'
              ? ''
              : theme.palette[
                  themeColor === undefined ? 'home_' : themeColor === 'home_undefined' ? 'home_' : themeColor
                ].main
          }
          icon='iconamoon:home-bold'
        />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {homes.map((item, index) => {
          return (
            <CanViewItems key={index + 1} item={item}>
              <MenuItem
                onClick={() => handleRouteChange(item.route)}
                sx={{ color: item.route === '/home' ? '' : theme.palette[item.color].main }}
              >
                <ListItemIcon>
                  <Icon color={item.route === '/home' ? '' : theme.palette[item.color].main} icon={item.icono} />
                </ListItemIcon>
                <strong>{t(item.titulo)}</strong>
              </MenuItem>
            </CanViewItems>
          )
        })}
      </Menu>
    </div>
  )
}

export default HomeDropdown
