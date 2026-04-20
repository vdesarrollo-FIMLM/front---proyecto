import React, { useEffect } from 'react'
import ListaArchivos from './ListaArchivos'
import { Box, Button, Dialog, DialogContent, Grid, IconButton, Modal } from '@mui/material'
import { useVisualizadorArchivos } from './useVisualizadorArchivos'
import Icon from 'src/@core/components/icon'
import { useState } from 'react'
import ModalSlider from 'src/components/Swiper/swiper-fotos/ModalSlider'
import Carousel from 'src/components/Swiper/swiper-fotos/Carousel'

/**
 * Permite visulizar archivos en iconos pequeños y utiliza un Swiper para visualizar los archivos en tamaño completo
 * Estructura requerida de datos
 * [
        {
            "id_adjunto": "67d1e3fb2ea11a63e57289b2",
            "nombre_original": "pexels-einfoto-30697068.jpg",
            "fecha_regsitro": "2025-03-12T14:43:55.729000"
        },
        {
            "id_adjunto": "67d2fd07389b4f708102de88",
            "nombre_original": "nombre video.mp4",
            "fecha_regsitro": "2025-03-13T10:43:03.179000"
        }
    ]
 * @param {array} adjuntos - Lista de archivos a visualizar
 * @returns
 */
const VisualizadorArchivos = props => {
  const { adjuntos, verMenuOpciones = true, previewPdf = true } = props
  const { listaArchivos, handleOnClickMenuOption } = useVisualizadorArchivos(adjuntos, previewPdf)
  const [abrirModalVistaPrevia, setAbrirModalVistaPrevia] = useState(false)
  const [archivosParaVistaPrevia, setArchivosParaVistaPrevia] = useState([])
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(0)
  const [abrirModalSwiper, setAbrirModalSwiper] = useState(false)
  const [numeroSlide, setNumeroSlide] = useState(0)

  const handleAbrirVistaPreviaModal = index => {
    setArchivoSeleccionado(index)
    setArchivosParaVistaPrevia(listaArchivos)
    setAbrirModalVistaPrevia(true)
  }

  const handleSiguienteImagen = () => {
    setArchivoSeleccionado(prevIndex => (prevIndex + 1) % archivosParaVistaPrevia.length)
  }

  const handleAnteriorImagen = () => {
    setArchivoSeleccionado(
      prevIndex => (prevIndex - 1 + archivosParaVistaPrevia.length) % archivosParaVistaPrevia.length
    )
  }

  const handleAbrirCarousel = archivo => {
    try {
      const index = listaArchivos.findIndex(item => item.id_adjunto === archivo.id_adjunto)
      setNumeroSlide(index)
      setAbrirModalSwiper(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Grid container spacing={3} sx={{ display: 'flex', padding: 2 }}>
        {listaArchivos?.length > 0 && listaArchivos[0] !== 'sin datos' && (
          <ListaArchivos
            listaArchivos={listaArchivos}
            onClick={value => {
              handleAbrirCarousel(value)
            }}
            onClickMenuOption={handleOnClickMenuOption}
            verMenuOpciones={verMenuOpciones}
            previewPdf={previewPdf}
          />
        )}
      </Grid>

      <Dialog fullScreen open={abrirModalSwiper}>
        <Box sx={{ m: 5, position: 'absolute', top: -15, right: 0, zIndex: 9999 }}>
          <IconButton onClick={() => setAbrirModalSwiper(false)}>
            <Icon icon='mdi:close' style={{ color: 'white' }} />
          </IconButton>
        </Box>
        <DialogContent sx={{ backgroundColor: 'black' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ mt: '35px', height: { xs: '50vh !important', md: '93vh !important' } }}>
              {abrirModalSwiper && listaArchivos.length > 0 && (
                <Carousel
                  listaImagenes={listaArchivos}
                  slide={numeroSlide}
                  handleAbrirModalSlider={setAbrirModalSwiper}
                  previewPdf={previewPdf}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Modal para previsualización con soporte de PDF y video */}
      <Modal open={abrirModalVistaPrevia} onClose={setAbrirModalVistaPrevia}>
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
          <IconButton
            onClick={() => setAbrirModalVistaPrevia(false)}
            sx={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <Icon icon='tabler:x' width={30} />
          </IconButton>

          <IconButton onClick={handleAnteriorImagen} sx={{ position: 'absolute', left: '10px', top: '50%' }}>
            <Icon icon='tabler:chevron-left' width={40} />
          </IconButton>

          {/* <Button
            onClick={e => {
              console.log(archivosParaVistaPrevia[archivoSeleccionado])
            }}
          >
            console
          </Button> */}

          <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', p: 10 }}>
            {archivosParaVistaPrevia[archivoSeleccionado] &&
              (archivosParaVistaPrevia[archivoSeleccionado].extension === '.pdf' ? (
                <embed
                  src={`data:application/pdf;base64,${archivosParaVistaPrevia[archivoSeleccionado].imagen}`}
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
                  src={`/proxy/streaming/${archivosParaVistaPrevia[archivoSeleccionado].id_adjunto}/file/`}
                  controls
                  style={{ width: '100%', height: '100%' }}
                  controlsList='nodownload'
                />
              ) : (
                <img
                  src={`data:image/jpeg;base64,${archivosParaVistaPrevia[archivoSeleccionado].imagen}`}
                  alt='Vista Previa'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ))}
          </Box>

          <IconButton onClick={handleSiguienteImagen} sx={{ position: 'absolute', right: '10px', top: '50%' }}>
            <Icon icon='tabler:chevron-right' width={40} />
          </IconButton>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {listaArchivos.map((_, index) => (
              <IconButton
                key={index + 1}
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

export default VisualizadorArchivos
