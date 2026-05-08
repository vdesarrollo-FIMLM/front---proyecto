import React from 'react'

import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'

import { useTranslation } from 'react-i18next'

const BasicModal = ({ setAbrirModal, abrirModal, children, title = 'Registrar Visita', maxWidth = 'lg' }) => {
  const { t } = useTranslation()

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      onClose={() => setAbrirModal(false)}
      open={abrirModal}
      scroll='body'
      sx={{ overflowY: '' }}
      PaperProps={{
        style: {
          overflowY: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5' component='span' sx={{ mb: 2 }}>
          {t(title)}
        </Typography>
        <Button
          variant='contained'
          aria-label='close'
          onClick={() => setAbrirModal(false)}
          color='error'
          sx={{ borderRadius: '30px' }}
        >
          x
        </Button>
      </DialogTitle>
      <DialogContent sx={{ overflow: 'visible' }}>{children}</DialogContent>
    </Dialog>
  )
}

export default BasicModal
