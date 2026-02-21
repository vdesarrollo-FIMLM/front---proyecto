import { useState } from 'react'

import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'

import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const LanguageDropdown = ({ settings }) => {
  // ** Hook
  const { t, i18n } = useTranslation()

  // ** Vars
  const { layout } = settings

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = e => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLangItemClick = lang => {
    i18n.changeLanguage(lang)
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        onClick={handleClick}
        sx={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      >
        <Icon icon='mdi:translate' />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleLangItemClick('es')}>
          <ListItemIcon>
            <Icon icon='openmoji:flag-spain' />
          </ListItemIcon>
          {t('Español')}
        </MenuItem>
        <MenuItem onClick={() => handleLangItemClick('en')}>
          <ListItemIcon>
            <Icon icon='openmoji:flag-united-states' />
          </ListItemIcon>
          {t('Inglés')}
        </MenuItem>
        <MenuItem onClick={() => handleLangItemClick('fr')}>
          <ListItemIcon>
            <Icon icon='openmoji:flag-france' />
          </ListItemIcon>
          {t('Francés')}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default LanguageDropdown
