// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'

const CardError = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTabletScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
  const isLaptopScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'))
  const isDesktopScreen = useMediaQuery(theme.breakpoints.up('xl'))

  // Styled Grid component
  const StyledGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      display: 'flex'
    }
  }))

  // Styled component for the image
  const Img = styled('img')(({ theme }) => ({
    right: 0,
    top: 0,
    width: 300,
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      position: 'static'
    }
  }))

  return (
    <>
      {isMobile && (
        <Card sx={{ position: 'relative' }}>
          <Grid container item sx={{ p: 2 }}>
            <Alert sx={{ width: '100%', height: 'auto' }} severity='error'>
              <Typography variant='h6' gutterBottom sx={{ color: theme.palette.error.main, fontWeight: 600 }}>
                Información Importante!
              </Typography>
              <Grid item xs={12}>
                <Typography variant='body1' sx={{ mb: 4 }}>
                  <strong>¡Recuerde!</strong> Hoy <strong>01 de enero</strong> Este es un mensaje de error. Actualice
                  aquí la información.
                </Typography>
              </Grid>
            </Alert>
          </Grid>
        </Card>
      )}
      {isTabletScreen && (
        <Card sx={{ position: 'relative' }}>
          <Grid container item sx={{ p: 2 }}>
            <Alert sx={{ width: '100%', height: 'auto' }} severity='error'>
              <Typography variant='h6' gutterBottom sx={{ color: theme.palette.error.main, fontWeight: 600 }}>
                Información Importante!
              </Typography>
              <Grid item xs={12}>
                <Typography variant='body1' sx={{ mb: 4 }}>
                  <strong>¡Recuerde!</strong> Hoy <strong>01 de enero</strong> Este es un mensaje de error. Actualice
                  aquí la información.
                </Typography>
              </Grid>
            </Alert>
          </Grid>
        </Card>
      )}
      {isLaptopScreen && (
        <Card sx={{ position: 'relative' }}>
          <Grid container item sx={{ p: 2 }}>
            <Alert sx={{ width: '100%', height: 'auto' }} severity='error'>
              <Typography variant='h6' gutterBottom sx={{ color: theme.palette.error.main, fontWeight: 600 }}>
                Información Importante!
              </Typography>

              <Grid container item xs={12}>
                <Grid item xs={8}>
                  <Typography variant='body1' sx={{ mb: 4 }}>
                    <strong>¡Recuerde!</strong> Hoy <strong>01 de enero</strong> Este es un mensaje de error. Actualice
                    aquí la información.
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <StyledGrid item xs={12}>
                    <Img alt='' src={`/home/Megafono.png`} sx={{ margin: '1rem 1rem 0 0', width: '150px' }} />
                  </StyledGrid>
                </Grid>
              </Grid>
            </Alert>
          </Grid>
        </Card>
      )}
      {isDesktopScreen && (
        <Card sx={{ position: 'relative' }}>
          <Grid container item sx={{ p: 2 }}>
            <Alert sx={{ width: '100%', height: 'auto' }} severity='error'>
              <Typography variant='h6' gutterBottom sx={{ color: theme.palette.error.main, fontWeight: 600 }}>
                Información Importante!
              </Typography>
              <Grid container item xs={12}>
                <Grid item xs={8}>
                  <Typography variant='body1' sx={{ mb: 4 }}>
                    <strong>¡Recuerde!</strong> Hoy <strong>01 de enero</strong> Este es un mensaje de error. Actualice
                    aquí la información.
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <StyledGrid item xs={12}>
                    <Img alt='' src={`/home/Megafono.png`} sx={{ margin: '1.5rem 1rem 0 0', width: '125px' }} />
                  </StyledGrid>
                </Grid>
              </Grid>
            </Alert>
          </Grid>
        </Card>
      )}
    </>
  )
}

export default CardError
