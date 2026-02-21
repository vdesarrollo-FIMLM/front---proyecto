import React from 'react'

import PropTypes from 'prop-types'

import { Dialog, DialogContent, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

const ModalDialog = ({ open, onClose, children, width, title }) => {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={width}
      onClose={() => null}
      scroll='body'
      sx={{ overflowY: '' }}
      PaperProps={{
        style: {
          overflowY: 'visible'
        }
      }}
    >
      <DialogContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>{title}</Typography>
        <IconButton
          size='small'
          onClick={onClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          color='error'
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogContent>

      <DialogContent sx={{ overflow: 'visible' }}>{children}</DialogContent>
    </Dialog>
  )
}

ModalDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  width: PropTypes.string,
  title: PropTypes.string
}

export default ModalDialog
