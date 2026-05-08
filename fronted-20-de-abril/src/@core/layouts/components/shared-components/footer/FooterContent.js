// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {/* {`© ${new Date().getFullYear()}, Hecha con `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` por la APP`} */}
      </Typography>
      {/* {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <a>
            Todos los derechos reservados ®
          </a>
          <Link target='_blank' href='https://app.org/'>
            app.org
          </Link>
          <Link target='_blank' href='https://domain.com/'>
            MLP.com
          </Link>
          <Link href='/soporte'>
            Soporte
          </Link>
        </Box>
      )} */}
    </Box>
  )
}

export default FooterContent
