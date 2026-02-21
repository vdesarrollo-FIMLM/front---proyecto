import { Box, CardMedia, Grid, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ICONOS_MULTIMEDIA } from 'src/utils/Iconos'
import Icon from 'src/@core/components/icon'
import { truncarMedioNombreArchivo } from 'src/utils/funciones'
import { EXTENSIONES_PDF, EXTENSIONES_IMAGEN, EXTENSIONES_VIDEO } from 'src/utils/constantes'
import { useTranslation } from 'react-i18next'

const TIPO_LISTA = {
  MINIATURA: 'miniatura',
  LISTA: 'lista'
}

const options = [
  {
    accion: 'descargar',
    label: 'Descargar',
    icon: 'eva:download-fill'
  },
  {
    accion: 'link',
    label: 'Copiar link',
    icon: 'material-symbols:link'
  }
]

const optionsVideo = [
  {
    accion: 'link',
    label: 'Copiar link'
  }
]

const ITEM_HEIGHT = 48

const ListaArchivos = props => {
  const { t } = useTranslation()
  const {
    listaArchivos,
    tipoLista = TIPO_LISTA.MINIATURA,
    onClick = () => {},
    onClickMenuOption,
    verMenuOpciones = true,
    previewPdf = true
  } = props
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
  const handleClick = (event, detalleArchivo) => {
    setAnchorEl(event.currentTarget)
    setArchivoSeleccionado(detalleArchivo)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setArchivoSeleccionado(null)
  }

  const handleOnClickMenu = (archivo, accion) => {
    try {
      if (archivoSeleccionado) {
        if (accion == 'link') {
          return onClickMenuOption(archivoSeleccionado, accion)
        } else {
          onClickMenuOption(archivoSeleccionado, accion)
        }
      }
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  const renderMenu = (detalleArchivo, extension) => {
    return (
      <div>
        <IconButton
          aria-label='more'
          id='long-button'
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={e => handleClick(e, detalleArchivo)}
        >
          <Icon icon='eva:more-vertical-fill' />
        </IconButton>
        <Menu
          id='long-menu'
          MenuListProps={{
            'aria-labelledby': 'long-button'
          }}
          anchorEl={anchorEl}
          open={open && archivoSeleccionado?.id_adjunto === detalleArchivo.id_adjunto}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch'
            }
          }}
          sx={{
            '.MuiMenu-paper': {
              boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.05)'
            }
          }}
        >
          {options.map(option =>
            EXTENSIONES_VIDEO.includes(extension) && option.accion === 'descargar' ? null : (
              <MenuItem
                aria-hidden='true'
                key={option.accion}
                onClick={async e => {
                  console.log('archivo seleccionado', detalleArchivo)
                  if (option.accion === 'descargar') {
                    handleOnClickMenu(detalleArchivo, option.accion)
                  } else {
                    let link = handleOnClickMenu(detalleArchivo, option.accion)

                    try {
                      await navigator.clipboard.writeText(link)
                      // Opcional: notificación, snackbar o console log
                      console.log('Link copiado al portapapeles:', link)
                    } catch (err) {
                      console.error('Error al copiar al portapapeles', err)
                    }
                  }
                  e.stopPropagation()
                }}
              >
                <ListItemIcon>
                  <Icon icon={option.icon} />
                </ListItemIcon>
                {t(option.label)}
              </MenuItem>
            )
          )}
        </Menu>
      </div>
    )
  }

  const renderTipoLista = (detalleArchivo, index) => {
    switch (tipoLista) {
      case TIPO_LISTA.MINIATURA:
        return renderMinuatura(detalleArchivo, index)
    }
  }

  const renderMinuatura = (detalleArchivo, index) => {
    try {
      let tieneMiniatura = false //Solo aplica para imagenes
      let icono = ''

      const extension = detalleArchivo?.nombre_original?.split('.').pop()

      if (detalleArchivo?.imagen && EXTENSIONES_IMAGEN.includes(extension)) {
        tieneMiniatura = true
        icono = `data:image/jpeg;base64,${detalleArchivo.imagen}`
      } else if (detalleArchivo?.imagen && EXTENSIONES_PDF.includes(extension)) {
        tieneMiniatura = true
        icono = previewPdf ? detalleArchivo.imagen : ICONOS_MULTIMEDIA[extension]
      } else {
        icono = ICONOS_MULTIMEDIA[extension] ? ICONOS_MULTIMEDIA[extension] : ICONOS_MULTIMEDIA['default']
      }

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '200px',
            boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.30)',
            borderRadius: '10px',
            minWidth: '170px',
            cursor: 'pointer'
          }}
        >
          <Box
            sx={{ width: '100%', height: '70%', display: 'flex', justifyContent: 'center' }}
            onClick={e => {
              onClick(detalleArchivo)
              e.stopPropagation()
            }}
          >
            {tieneMiniatura && EXTENSIONES_IMAGEN.includes(extension) && (
              <img
                src={icono}
                alt={detalleArchivo.nombre_original}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '140px',
                  objectFit: 'cover',
                  borderRadius: '10px 10px 0px 0px',
                  animation: 'fadeIn 10s',
                  '@keyframes fadeIn': {
                    '0%': {
                      opacity: 0
                    },
                    '100%': {
                      opacity: 1
                    }
                  }
                }}
              />
            )}

            {tieneMiniatura && EXTENSIONES_PDF.includes(extension) && (
              <Box sx={{ position: 'relative', pt: 2 }}>
                <Icon icon='teenyicons:pdf-solid' height='140' />
              </Box>
            )}

            {!tieneMiniatura && (
              <Box sx={{ position: 'relative', pt: 2 }}>
                <Icon icon={icono} height={'140px'} />
              </Box>
            )}
          </Box>

          <Box mt={3} sx={{ mx: 5, width: '100%', height: '30%', display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={detalleArchivo.nombre_original} placement='top'>
              <Typography
                variant='body2'
                sx={{
                  mx: 2,
                  fontSize: '0.8rem'
                }}
              >
                {truncarMedioNombreArchivo(detalleArchivo.nombre_original, 35)}
              </Typography>
            </Tooltip>
            {/* {!EXTENSIONES_VIDEO.includes(extension) && renderMenu(detalleArchivo)} */}

            {extension && renderMenu(detalleArchivo, extension)}
          </Box>
        </Box>
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    listaArchivos.length > 0 &&
    listaArchivos.map((detalleArchivo, index) => {
      return (
        <Box
          key={index + 1}
          mb={3}
          mr={3}
          sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}
        >
          {verMenuOpciones && renderTipoLista(detalleArchivo, index)}
        </Box>
      )
    })
  )
}

export default ListaArchivos
