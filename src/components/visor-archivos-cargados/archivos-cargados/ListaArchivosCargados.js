import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
  useTheme,
  IconButton,
  CardMedia,
  Box,
  Modal,
  Fade,
  LinearProgress,
  Button,
  CircularProgress
} from '@mui/material'
import { ICONOS_MULTIMEDIA } from 'src/utils/Iconos'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import { truncarTexto, truncarMedioNombreArchivo } from 'src/utils/funciones'

const extensionesVistaPrevia = ['.png', '.jpeg', '.jpg', '.mp4', '.pdf']
const extensionesMiniatura = ['.png', '.jpeg', '.jpg']

const ListaArchivosCargados = props => {
  const { t } = useTranslation()
  const theme = useTheme()

  const descargarRef = useRef(null)

  const {
    listaArchivos,
    height = 150,
    width = 150,
    handleVerVistaPrevia,
    handleDescargarArchivo,
    descargandoArchivo,
    variant,
    styles,
    mostrarHover
  } = props

  const defaultStyles = {
    objectFit: 'cover',
    height: height,
    width: width,
    borderRadius: 10
  }

  const [hoveredFile, setHoveredFile] = useState(null)

  const handleMouseEnter = file => {
    setHoveredFile(file)
  }

  const handleMouseLeave = () => {
    setHoveredFile(null)
  }

  const onHoverOpciones = (idArchivo, index) => {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          width: '100%',
          height: 'calc(100% - 6px)',
          borderRadius: 1,
          zIndex: 9999
        }}
      >
        <Tooltip title={t('Descargar')}>
          <IconButton ref={descargarRef} onClick={event => handleDescargarArchivo(idArchivo, index, event)}>
            <Icon icon='material-symbols:download-sharp' color='white' />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  const tipoIcono = archivo => {
    let icono = {}

    //Valida las extensiones que tienen vista previa
    if (extensionesVistaPrevia.includes(archivo.extension)) {
      icono.vistaPrevia = true

      //Para mostrar la miniatura de la imagen
      if (extensionesMiniatura.includes(archivo.extension)) {
        icono.ruta = `data:image/jpeg;base64,${archivo.imagen}`
        icono.miniatura = true
      } else {
        //Muestra un icono dependiendo de la extension
        const ic = ICONOS_MULTIMEDIA[archivo.extension.slice(1)]
        icono.ruta = ic
        icono.miniatura = false
      }
    } else {
      //Muestra un icono por defecto
      const ic = ICONOS_MULTIMEDIA[archivo.extension.slice(1)]
      icono.miniatura = false

      if (ic !== undefined) {
        icono.ruta = ic
      } else {
        icono.ruta = 'ph:files-light'
      }
    }

    return icono
  }

  //Retorna la miniatura o el icono dependiendo del tipo de archivo
  const tipoMiniatura = (archivo, index) => {
    const icono = tipoIcono(archivo)

    return (
      <Grid
        item
        key={archivo.id_adjunto}
        sx={{
          display: 'flex'
        }}
      >
        <Grid item xs={12}>
          {icono.miniatura ? (
            <>
              <Box
                sx={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter(archivo.id_adjunto)}
                onMouseLeave={handleMouseLeave}
                onClick={e => {
                  if (icono.vistaPrevia) {
                    handleVerVistaPrevia(archivo)
                  }
                }}
              >
                <img style={{ ...defaultStyles, ...styles }} src={`${icono.ruta}`} alt='Imagenes cargadas' />
                {hoveredFile == archivo.id_adjunto && mostrarHover && onHoverOpciones(archivo.id_adjunto, index)}

                {descargandoArchivo[index] && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      width: '100%',
                      height: 'calc(100% - 6px)',
                      borderRadius: 1,
                      zIndex: 9999
                    }}
                  >
                    <CircularProgress color={'primary'} />
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Box
              sx={{ position: 'relative' }}
              onMouseEnter={() => handleMouseEnter(archivo.id_adjunto)}
              onMouseLeave={handleMouseLeave}
              onClick={e => {
                if (icono.vistaPrevia) {
                  handleVerVistaPrevia(archivo)
                }
              }}
            >
              <Grid
                item
                sx={{
                  border: 1,
                  borderColor: theme.palette.divider,
                  borderRadius: 1
                }}
              >
                <Box
                  sx={{
                    height: height,
                    width: width,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Icon icon={icono.ruta} width='60%' />
                </Box>
              </Grid>
              {hoveredFile == archivo.id_adjunto && onHoverOpciones(archivo.id_adjunto, index)}

              {descargandoArchivo[index] && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    height: 'calc(100% - 6px)',
                    borderRadius: 1,
                    zIndex: 9999
                  }}
                >
                  <CircularProgress color={'primary'} />
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    )
  }

  const tipoLista = (archivo, index) => {
    try {
      const icono = tipoIcono(archivo)

      return (
        <Grid key={archivo.id_adjunto} item xs={12} sx={{}}>
          {icono.miniatura ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: 1,
                  borderColor: theme.palette.divider,
                  borderRadius: 1,
                  p: 2,
                  gap: 3,
                  width: '100%'
                }}
                onMouseEnter={() => handleMouseEnter(archivo.id_adjunto)}
                onMouseLeave={handleMouseLeave}
                onClick={e => {
                  if (icono.vistaPrevia) {
                    handleVerVistaPrevia(archivo)
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
                  <img
                    style={{ objectFit: 'cover', height: height - 100, width: width - 100, borderRadius: 10 }}
                    src={`${icono.ruta}`}
                    alt='Imagenes cargadas'
                  />

                  {descargandoArchivo[index] && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        width: '100%',
                        height: 'calc(100%)',
                        borderRadius: 1,
                        zIndex: 9999
                      }}
                    >
                      <CircularProgress color={'primary'} />
                    </Box>
                  )}

                  <Box sx={{}}>
                    <Typography variant='body1' sx={{ textAlign: 'center' }}>
                      {archivo?.nombre_original?.slice(1, 30)} - {archivo?.peso_imagen}
                    </Typography>
                  </Box>
                </Box>

                <Tooltip title={t('Descargar')}>
                  <IconButton onClick={event => handleDescargarArchivo(archivo.id_adjunto, index, event)}>
                    <Icon icon='material-symbols:download-sharp' />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box
              sx={{ position: 'relative' }}
              onMouseEnter={() => handleMouseEnter(archivo.id_adjunto)}
              onMouseLeave={handleMouseLeave}
              onClick={e => {
                if (icono.vistaPrevia) {
                  handleVerVistaPrevia(archivo)
                }
              }}
            >
              <Box
                sx={{
                  border: 1,
                  borderColor: theme.palette.divider,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
                  <Box
                    sx={{
                      height: height - 87,
                      width: width - 87,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Icon icon={icono.ruta} width='60%' />
                  </Box>

                  <Box sx={{}}>
                    <Tooltip title={archivo?.nombre_original}>
                      <Typography variant='body2'>
                        {truncarMedioNombreArchivo(archivo?.nombre_original, 50)} - {archivo?.peso_imagen}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Box>

                <Box mr={2}>
                  <Tooltip title={t('Descargar')}>
                    <IconButton onClick={event => handleDescargarArchivo(archivo.id_adjunto, index, event)}>
                      <Icon icon='material-symbols:download-sharp' />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {descargandoArchivo[index] && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    height: 'calc(100%)',
                    borderRadius: 1,
                    zIndex: 9999
                  }}
                >
                  <CircularProgress color={'primary'} />
                </Box>
              )}
            </Box>
          )}
        </Grid>
      )
    } catch (error) {
      console.error(error)
    }
  }

  const renderVariant = (variant, archivo, index) => {
    switch (variant) {
      case 'miniatura':
        return tipoMiniatura(archivo, index)

      case 'lista':
        return tipoLista(archivo, index)

      default:
        break
    }
  }

  return (
    <Grid container item spacing={3} xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      {listaArchivos.length > 0
        ? listaArchivos.map((archivo, index) => {
            return renderVariant(variant, archivo, index)
          })
        : null}
    </Grid>
  )

  /* return (
    <Grid container item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      {listaArchivos.length > 0
        ? listaArchivos.map((archivo, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  mx: 3,
                  my: 3,
                  backgroundColor: 'green'
                }}
              >
                {renderVariant(variant, archivo, index)}
              </Box>
            )
          })
        : null}
    </Grid>
  ) */
}

export default ListaArchivosCargados
