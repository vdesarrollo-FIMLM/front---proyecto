// ** React Import
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

// i18n Imports
import { useTranslation } from 'react-i18next'
import { useSettings } from 'src/@core/hooks/useSettings'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: 298,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    position: 'static'
  }
}))

const CardInicio = () => {
  const auth = useAuth()
  const { t } = useTranslation()

  const theme = useTheme()
  const { settings, saveSettings } = useSettings()

  const user = auth.user.username

  return (
    <Card
      sx={{
        position: 'relative',
        mb: 5,
        background: `linear-gradient(to bottom, ${theme.palette[settings.themeColor].dark}, ${theme.palette[settings.themeColor].light})`
      }}
    >
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            {' '}
            <Typography variant='h5' sx={{ mb: 6, color: 'white' }}>
              ¡{t('Bienvenido')}{' '}
              <Box component='span' sx={{ fontWeight: 'bold', color: 'white' }}>
                {user}
              </Box>
              ! 🎉
            </Typography>
            <Typography sx={{ mb: 3, color: 'white' }} variant='body1'>
              {t('La herramienta de gestión de información')}.
            </Typography>
            <Typography variant='body1' sx={{ color: 'white' }}>
              {t('Recuerde que el acceso a esta herramienta no debe ser delegada')}.
            </Typography>
            <Typography sx={{ mt: 3, color: 'white' }} variant='body1'>
              {t('Es para uso exclusivo del propietario de la cuenta')}.
            </Typography>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='' src={`/home/illustration-john-light.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardInicio
