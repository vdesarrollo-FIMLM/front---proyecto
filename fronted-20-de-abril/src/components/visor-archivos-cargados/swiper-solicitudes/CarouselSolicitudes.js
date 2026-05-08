import { useEffect, useState } from 'react'

// ** Styled Component Import
import clsx from 'clsx'
import 'keen-slider/keen-slider.min.css'

//import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import { useKeenSlider } from 'keen-slider/react'
import {
  Backdrop,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  IconButton,
  Modal,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import Icon from 'src/@core/components/icon'

const KeenSliderWrapper = styled('div')(({ theme }) => ({
  '& .keen-slider': {
    backgroundColor: '#2d3436',

    height: '90vh',
    '& .keen-slider__slide': {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',

      '& img': {
        objectFit: 'contain',
        maxWidth: '100%',
        maxHeight: '100vh'
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

    //height: 'calc(100vh-10rem)',
    '& .arrow': {
      borderRadius: '7px',
      top: '50%',
      width: '3rem',

      height: '3rem',
      cursor: 'pointer',
      position: 'absolute',
      transform: 'translateY(-50%)',
      color: theme.palette.common.white,
      backgroundColor: 'rgb(223, 230, 233, 0.5)',
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

const CarouselSolicitudes = props => {
  const { listaImagenes, slide, handleAbrirModalSlider } = props
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
        default:
          break
        case 'Left':
        case 'ArrowLeft':
          slider.prev()
          break
        case 'Right':
        case 'ArrowRight':
          slider.next()
          break

        case 'Escape':
          handleAbrirModalSlider(false)
          break
      }
    }

    slider.on('created', () => {
      slider.container.setAttribute('tabindex', 0)
      slider.container.addEventListener('focus', eventFocus)
      slider.container.addEventListener('blur', eventBlur)
      slider.container.addEventListener('keydown', eventKeydown)
      slider.container.focus()
    })
  }

  const {
    settings: { direction }
  } = useSettings()

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider(
    {
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
  }, [])

  return (
    <KeenSliderWrapper>
      <Box className='navigation-wrapper'>
        <Box ref={sliderRef} className='keen-slider'>
          {listaImagenes.length > 0 &&
            listaImagenes.map((archivo, index) => (
              <Box key={index} className='keen-slider__slide'>
                <img src={`data:image/jpeg;base64,${archivo.imagen}`} alt='swiper 1' />
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
      {loaded && instanceRef.current && (
        <Box className='swiper-dots'>
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
            return (
              <Badge
                key={idx}
                variant='dot'
                component='div'
                className={clsx({
                  active: currentSlide === idx
                })}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx)
                }}
              ></Badge>
            )
          })}
        </Box>
      )}
    </KeenSliderWrapper>
  )
}

export default CarouselSolicitudes
