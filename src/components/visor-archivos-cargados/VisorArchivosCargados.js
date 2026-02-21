import { useState } from 'react'
import {
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
  IconButton,
  CardMedia,
  Box,
  LinearProgress,
  Modal
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { getArchivosBase64 } from 'src/api/utilidades'
import { ICONOS_MULTIMEDIA } from 'src/utils/Iconos'
import { useTranslation } from 'react-i18next'

const mime_types = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  mov: 'video/quicktime',
  flv: 'video/x-flv',
  mp4: 'video/mp4',
  mpg: 'video/mpeg',
  mpeg: 'video/mpeg',
  wmv: 'video/x-ms-wmv',
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12'
}

const extensionesVistaPrevia = Object.keys(mime_types).map(ext => `.${ext}`)
const extensionesMiniatura = ['.png', '.jpeg', '.jpg', '.pdf']

const VisorArchivosCargados = ({
  listaArchivos,
  handleEliminarAdjunto = undefined,
  showTitle = true,
  downLoadFile = true,
  showContent = true
}) => {
  const [abrirVistaPreviaModal, setAbrirVistaPreviaModal] = useState(false)
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(0)
  const [archivosParaVistaPrevia, setArchivosParaVistaPrevia] = useState([])
  const [descargandoArchivo, setDescargandoArchivo] = useState(Array(listaArchivos.length).fill(false))

  const { t } = useTranslation()

  const handleAbrirVistaPreviaModal = index => {
    setArchivoSeleccionado(index)
    setArchivosParaVistaPrevia(listaArchivos.filter(item => extensionesVistaPrevia.includes(item.extension)))
    setAbrirVistaPreviaModal(true)
  }

  const handleCerrarVistaPreviaModal = () => {
    setAbrirVistaPreviaModal(false)
  }

  const handleSiguienteImagen = () => {
    setArchivoSeleccionado(prevIndex => (prevIndex + 1) % archivosParaVistaPrevia.length)
  }

  const handleAnteriorImagen = () => {
    setArchivoSeleccionado(
      prevIndex => (prevIndex - 1 + archivosParaVistaPrevia.length) % archivosParaVistaPrevia.length
    )
  }

  const handleDescargarArchivo = async (idAdjunto, index) => {
    try {
      const newLoadingStates = [...descargandoArchivo]
      newLoadingStates[index] = true
      setDescargandoArchivo(newLoadingStates)

      const result = await getArchivosBase64(idAdjunto)

      const link = document.createElement('a')
      link.href = result.url
      link.download = `adjunto${result.extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setDescargandoArchivo(Array(listaArchivos.length).fill(false))
    } catch (error) {
      console.error(error)
      setDescargandoArchivo(Array(listaArchivos.length).fill(false))
    }
  }

  const tipoIcono = archivo => {
    let icono = {}

    if (extensionesVistaPrevia.includes(archivo.extension)) {
      icono.vistaPrevia = true

      if (extensionesMiniatura.includes(archivo.extension)) {
        if (archivo.extension === '.pdf') {
          icono.ruta = `${archivo.imagen}`
        } else {
          icono.ruta = `data:image/jpeg;base64,${archivo.imagen}`
        }
        icono.miniatura = true
      } else {
        const ic = ICONOS_MULTIMEDIA[archivo.extension.slice(1)]
        icono.ruta = ic
        icono.miniatura = false
      }
    } else {
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

  const base64ToBlobPdf = base64Data => {
    const byteCharacters = atob(base64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' })
    const fileUrl = URL.createObjectURL(blob)

    return fileUrl
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} sx={{ my: 5, display: showTitle ? 'inline-block' : 'none' }}>
          <Typography variant='h5' fontWeight='bold'>
            {`${t('Archivos cargados')} (${listaArchivos.length})`}
          </Typography>
        </Grid>
        <Grid container item xs={12}>
          {listaArchivos.length > 0
            ? listaArchivos.map((archivo, index) => {
                const tipoArchivo = archivo => {
                  const icono = tipoIcono(archivo)

                  return (
                    <Grid
                      key={index + 1}
                      item
                      xs={12}
                      onClick={() => {
                        if (icono.vistaPrevia) {
                          handleAbrirVistaPreviaModal(index)
                        }
                      }}
                      sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                    >
                      {icono.miniatura ? (
                        archivo.extension === '.pdf' ? (
                          <CardMedia component='img' height='194' image={icono.ruta} alt='Icono' />
                        ) : (
                          <CardMedia component='img' height='194' image={icono.ruta} alt='Icono' />
                        )
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 3
                          }}
                        >
                          <Icon icon={icono.ruta} width={150} />
                          {!icono.vistaPrevia && (
                            <Typography variant='caption'>
                              {t('Sin vista previa')} {`(${archivo.extension})`}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Grid>
                  )
                }

                return (
                  <Box
                    key={index + 1}
                    sx={{
                      display: 'flex',
                      mx: 3,
                      my: 3
                    }}
                  >
                    <Card key={index + 1} sx={{ width: '100%' }}>
                      {tipoArchivo(archivo)}

                      {showContent && (
                        <CardContent sx={{ minHeight: 10 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                            {handleEliminarAdjunto !== undefined && (
                              <Tooltip title='Eliminar'>
                                <IconButton onClick={() => handleEliminarAdjunto(archivo)}>
                                  <Icon fontSize={25} icon='tabler:trash' />
                                </IconButton>
                              </Tooltip>
                            )}

                            {downLoadFile && (
                              <Tooltip title='Descargar'>
                                <IconButton onClick={() => handleDescargarArchivo(archivo.id_adjunto, index)}>
                                  <Icon fontSize={25} icon='material-symbols:download-sharp' />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                          <Box
                            sx={{
                              width: '100%',
                              display: descargandoArchivo[index] ? 'inline-block' : 'none'
                            }}
                          >
                            <LinearProgress />
                          </Box>
                        </CardContent>
                      )}
                    </Card>
                  </Box>
                )
              })
            : null}
        </Grid>
      </Grid>

      {/* Modal para previsualización con soporte de PDF y video */}
      <Modal open={abrirVistaPreviaModal} onClose={handleCerrarVistaPreviaModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            height: '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <IconButton onClick={handleCerrarVistaPreviaModal} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
            <Icon icon='tabler:x' width={30} />
          </IconButton>

          <IconButton onClick={handleAnteriorImagen} sx={{ position: 'absolute', left: '10px', top: '50%' }}>
            <Icon icon='tabler:chevron-left' width={40} />
          </IconButton>

          {archivosParaVistaPrevia[archivoSeleccionado] &&
            (archivosParaVistaPrevia[archivoSeleccionado].extension === '.pdf' ? (
              <embed
                src={base64ToBlobPdf(archivosParaVistaPrevia[archivoSeleccionado].imagen)}
                type='application/pdf'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: '90%',
                  height: '90%'
                }}
              />
            ) : archivosParaVistaPrevia[archivoSeleccionado].extension === '.mp4' ? (
              <video
                controls
                style={{
                  width: '70%',
                  height: 'auto'
                }}
              >
                <source
                  src={`data:video/mp4;base64,${archivosParaVistaPrevia[archivoSeleccionado].imagen}`}
                  type='video/mp4'
                />
                Tu navegador no soporta la reproducción de videos.
              </video>
            ) : (
              <img
                src={`data:image/jpeg;base64,${archivosParaVistaPrevia[archivoSeleccionado].imagen}`}
                alt='Vista Previa'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            ))}

          <IconButton onClick={handleSiguienteImagen} sx={{ position: 'absolute', right: '10px', top: '50%' }}>
            <Icon icon='tabler:chevron-right' width={40} />
          </IconButton>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {archivosParaVistaPrevia.map((_, index) => (
              <IconButton
                key={index}
                sx={{
                  width: 5,
                  height: 5,
                  bgcolor: archivoSeleccionado === index ? 'primary.main' : 'grey.400',
                  mx: 0.4,
                  borderRadius: '50%'
                }}
                onClick={() => setArchivoSeleccionado(index)}
              />
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default VisorArchivosCargados
