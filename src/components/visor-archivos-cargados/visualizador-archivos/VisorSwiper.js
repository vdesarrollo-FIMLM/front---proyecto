import React, { useState } from 'react'
import clsx from 'clsx'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

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

const VisorSwiper = () => {
  const [abrirModalCarousel, setAbrirModalCarousel] = useState(false)

  return (
    <ModalSlider abrirModal={abrirModalCarousel} handleAbrirModalSlider={setAbrirModalCarousel}>
      {/*  <Zoom in={abrirModalCarousel} style={{ transitionDelay: abrirModalCarousel ? '500ms' : '50ms' }}> */}
      <Grid item xs={12} sx={{ backgroundColor: '#2d3436' }}>
        {imagenes.length > 0 && (
          <Carousel listaImagenes={imagenes} slide={slide} handleAbrirModalSlider={setAbrirModalCarousel} />
        )}
      </Grid>
    </ModalSlider>
  )
}

export default VisorSwiper
