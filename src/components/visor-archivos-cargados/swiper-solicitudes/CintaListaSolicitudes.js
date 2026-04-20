import { useEffect, useState } from 'react'

// ** Styled Component Import
import clsx from 'clsx'
import 'keen-slider/keen-slider.min.css'

//import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import { useKeenSlider } from 'keen-slider/react'
import { Box, Grid, styled, useMediaQuery, useTheme } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import Icon from 'src/@core/components/icon'
import ModalSlider from 'src/components/Swiper/swiper-fotos/ModalSlider'
import CarouselSolicitudes from './CarouselSolicitudes'

const KeenSliderWrapper = styled('div')(({ theme }) => ({
  '& .keen-slider': {
    height: 'auto',
    '& .keen-slider__slide': {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',

      '& img': {
        objectFit: 'cover',
        height: '200px',
        width: '200px',
        borderRadius: '5px'
      }
    },
    '&.thumbnail .keen-slider__slide:not(.active)': {
      opacity: 0.4
    },

    '&.zoom-out': {
      perspective: '1000px',
      '& .zoom-out__slide': {
        '& .slider-content-wrapper': {
          width: '100%',
          height: '100%',
          position: 'absolute',
          '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            backgroundColor: 'transparent'
          }
        }
      }
    },

    '& .default-slide': {
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.background.default
    }
  },

  //  ** Fade
  /*   '& .fader': {
    position: 'relative',
    overflow: 'hidden',
    '& .fader__slide': {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0',
      '& img': {
        width: ' 100%',
        height: ' 100%',
        objectFit: 'cover',
        position: 'absolute'
      }
    }
  },
 */
  // ** Navigation Controls
  '& .navigation-wrapper': {
    position: 'relative',
    '& .arrow': {
      borderRadius: '7px',
      top: '50%',
      width: '3rem',

      height: '3rem',
      cursor: 'pointer',
      position: 'absolute',
      transform: 'translateY(-50%)',
      color: theme.palette.info.main,
      backgroundColor: 'rgb(0, 0, 0, 0.2)',
      ...(theme.direction === 'rtl' ? { transform: 'translateY(-50%) rotate(180deg)' } : {}),
      '&.arrow-disabled': {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        color: theme.palette.action.disabled
      },
      '&.arrow-left': {
        left: 0
      },
      '&.arrow-right': {
        right: 0
      }
    }
  },

  // ** Dots
  '& .swiper-dots': {
    display: 'flex',
    height: 'auto',
    justifyContent: 'center',
    marginBottom: '2rem',
    marginTop: theme.spacing(4),

    '& .MuiBadge-root': {
      '&:not(:last-child)': {
        marginRight: theme.spacing(4)
      },
      '& .MuiBadge-dot': {
        width: 10,
        height: 10,
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: 'white'
      },
      '&.active .MuiBadge-dot': {
        backgroundColor: theme.palette.info.main
      }
    }
  }
}))

const CintaListaSolicitudes = props => {
  const theme = useTheme()
  const { slide, imagenes, setAbrirModalCarousel, abrirModalCarousel } = props
  const [cantidadImagenes, setCantidadImagenes] = useState(2)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const matchesLG = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const matchesXL = useMediaQuery(theme => theme.breakpoints.up('xl'))
  const isTabletScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  useEffect(() => {
    if (matchesXL) {
      setCantidadImagenes(2)
    }
    if (matchesLG) {
      setCantidadImagenes(2)
    }

    if (isTabletScreen) {
      setCantidadImagenes(2)
    }

    if (isMobile) {
      setCantidadImagenes(1)
    }
  }, [matchesXL, isTabletScreen, matchesLG, isMobile])

  const handleAbrirVistaPrevia = index => {
    setTimeout(() => {
      setAbrirModalCarousel(true)
    }, 100)
  }
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const KeyboardControls = slider => {
    let focused = false

    function eventFocus() {
      focused = true
    }

    function eventBlur() {
      focused = false
    }

    function eventKeydown(e) {
      if (!focused) return
      switch (e.key) {
        case 'Left':
        case 'ArrowLeft':
          slider.prev()
          break
        case 'Right':
        case 'ArrowRight':
          slider.next()
          break
        default:
          break
      }
    }

    slider.on('created', () => {
      slider.container.setAttribute('tabindex', 0)
      slider.container.addEventListener('focus', eventFocus)
      slider.container.addEventListener('blur', eventBlur)
      slider.container.addEventListener('keydown', eventKeydown)
    })
  }

  const {
    settings: { direction }
  } = useSettings()

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slides: {
        perView: cantidadImagenes
      },
      rtl: direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [KeyboardControls]
  )

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current?.moveToIdx(slide, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ModalSlider abrirModal={abrirModalCarousel} handleAbrirModalSlider={setAbrirModalCarousel}>
        <Grid item xs={12} sx={{ backgroundColor: '#2d3436' }}>
          {imagenes.length > 0 && (
            <CarouselSolicitudes
              listaImagenes={imagenes}
              slide={currentSlide} // Asegura que el slide actual sea el correcto
              handleAbrirModalSlider={setAbrirModalCarousel}
            />
          )}
        </Grid>
      </ModalSlider>

      <KeenSliderWrapper>
        <Box className='navigation-wrapper'>
          <Box ref={sliderRef} className='keen-slider'>
            {imagenes.length > 0 &&
              imagenes.map((archivo, index) => (
                <Box key={index} className='keen-slider__slide'>
                  <img
                    onClick={() => handleAbrirVistaPrevia(index)} // Usa directamente handleAbrirVistaPrevia
                    src={`data:image/jpeg;base64,${archivo.imagen}`}
                    alt={`Imagen ${index + 1}`} // Alt mejorado para accesibilidad
                  />
                </Box>
              ))}
          </Box>
          {loaded && instanceRef.current && (
            <>
              <Icon
                icon='mdi:chevron-left'
                className={clsx('arrow arrow-left', {
                  'arrow-disabled': currentSlide === 0
                })}
                onClick={e => e.stopPropagation() || instanceRef.current?.prev()}
              />

              <Icon
                icon='mdi:chevron-right'
                className={clsx('arrow arrow-right', {
                  'arrow-disabled': currentSlide === instanceRef.current.track.details.slides.length - 1
                })}
                onClick={e => e.stopPropagation() || instanceRef.current?.next()}
              />
            </>
          )}
        </Box>
      </KeenSliderWrapper>
    </>
  )
}

export default CintaListaSolicitudes
