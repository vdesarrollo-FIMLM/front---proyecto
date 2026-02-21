// ** MUI Imports
import { Grid, Typography } from '@mui/material'

import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import CardInicio from './CardInicio'

// ** Permisos Imports

const HomeInicio = () => {
  // ** Hook
  const { user } = useAuth()

  const { t } = useTranslation()

  return (
    <Grid container spacing={5}>
      {/* Cards Principales */}
      <Grid container item xs={12} spacing={5}>
        <Grid item xs={12}>
          <CardInicio />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomeInicio
