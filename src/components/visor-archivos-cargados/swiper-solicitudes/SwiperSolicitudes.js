import { CircularProgress, Grid } from '@mui/material'
import { useSwiperFotos } from 'src/components/Swiper/swiper-fotos/useSwiperFotos'
import CintaListaSolicitudes from './CintaListaSolicitudes'

const SwiperFotos = props => {
  const { adjuntos } = props

  const { listaImagenes64, abrirModalCarousel, setAbrirModalCarousel, loading, setCurrentSlide } =
    useSwiperFotos(adjuntos)

  const handleAbrirVistaPrevia = index => {
    setCurrentSlide(index) // Establece el índice correcto de la imagen seleccionada
    setAbrirModalCarousel(true) // Abre el modal
  }

  return (
    <>
      <Grid item xs={12}>
        {listaImagenes64.length > 0 && (
          <CintaListaSolicitudes
            imagenes={listaImagenes64}
            abrirModalCarousel={abrirModalCarousel}
            setAbrirModalCarousel={setAbrirModalCarousel}
            handleAbrirVistaPrevia={handleAbrirVistaPrevia} // Pasa la función para manejar los clics
            slide={0}
          />
        )}
      </Grid>

      {loading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
    </>
  )
}

export default SwiperFotos
