import { defaultBlackColor } from '@iconify/tools/lib/colors/attribs'

const DefaultPalette = (mode, skin) => {
  // ** Vars
  const whiteColor = '#FFF'
  const lightColor = '76, 78, 100'
  const darkColor = '234, 234, 255'
  const mainColor = mode === 'light' ? lightColor : darkColor

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor
    } else if (skin === 'bordered' && mode === 'dark') {
      return '#30334E'
    } else if (mode === 'light') {
      return '#FFFFFF'
    } else return '#282A42'
  }

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      darkBg: '#282A42',
      grayBg: '#F7F7F9',
      lightBg: '#FFFFFF',
      bodyBg: mode === 'light' ? '#FFFFFF' : '#282A42',
      trackBg: mode === 'light' ? '#FFFFFF' : '#41435C',
      tooltipBg: mode === 'light' ? '#262732' : '#464A65',
      tableHeaderBg: mode === 'light' ? '#F5F5F7' : '#3A3E5B'
    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor
    },
    appstyle: {
      light: '#0047B6',
      main: '#0047B6',
      dark: '#8795c5',
      mainOpacity80: '#e7eaf3',
      contrastText: whiteColor
    },
    fimlmstyle: {
      light: '#89cff0',
      main: '#0000ff',
      dark: '#000066',
      mainOpacity80: '#e7eaf3',
      contrastText: whiteColor
    },
    primary: {
      light: '#787EFF',
      main: '#666CFF',
      dark: '#5A5FE0',
      mainOpacity80: '#e7eaf3',
      contrastText: whiteColor
    },
    secondary: {
      light: '#7F889B',
      main: '#6D788D',
      dark: '#606A7C',
      contrastText: whiteColor
    },
    error: {
      light: '#FF625F',
      main: '#FF4D49',
      dark: '#E04440',
      secondary: '#6e7fb9',
      contrastText: whiteColor
    },
    warning: {
      light: '#FDBE42',
      main: '#FDB528',
      dark: '#DF9F23',
      contrastText: whiteColor,
      secondary: '#FFC107'
    },
    info: {
      light: '#40CDFA',
      main: '#26C6F9',
      dark: '#21AEDB',
      contrastText: whiteColor,
      secondary: '#0D47A1'
    },
    success: {
      light: '#83E542',
      main: '#72E128',
      dark: '#64C623',
      contrastText: whiteColor
    },

    home_economico: {
      light: '#53C4B8',
      main: '#12A192',
      dark: '#0D7B75',
      contrastText: whiteColor
    },

    home_: {
      light: '#3c569b',
      main: '#0C2D83',
      dark: '#092468',
      contrastText: whiteColor
    },

    // Colores logo

    // azulclaro
    azulClaroLogo: {
      light: '#4da1c6',
      main: '#14719f',
      dark: '#4da6d6',
      mainOpacity80: '#e7eaf3',
      contrastText: whiteColor
    },

    // azuloscuro
    azulOscuroLogo: {
      light: '#3d7a99',
      main: '#00456a',
      dark: '#002f46',
      mainOpacity80: '#e7eaf3',
      contrastText: whiteColor
    },

    home_mi_nueva_familia: {
      light: '#f6d7ffff',
      main: '#b690e6ff',
      dark: '#2e1342ff',
      contrastText: whiteColor
    },

    /** Prioridades */
    baja: {
      main: '#0D47A1',
      contrastText: whiteColor
    },
    media: {
      main: '#e9d832',
      contrastText: whiteColor
    },
    alta: {
      main: '#FF8C00',
      contrastText: whiteColor
    },
    urgente: {
      main: '#FF0000',
      contrastText: whiteColor
    },
    cerrado: {
      main: '#2ecc71',
      contrastText: whiteColor
    },

    standbycolor: {
      main: '#ff5900',
      contrastText: whiteColor
    },

    pendienteProgramar: {
      main: '#ffbf00',
      contrastText: whiteColor
    },

    finalizado: {
      main: '#209227',
      contrastText: whiteColor
    },

    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161'
    },
    text: {
      primary: `rgba(${mainColor}, 0.87)`,
      secondary: `rgba(${mainColor}, 0.6)`,
      disabled: `rgba(${mainColor}, 0.38)`
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === 'light' ? whiteColor : '#30334E',
      default: defaultBgColor()
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.05)`,
      hoverOpacity: 0.05,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  }
}

export default DefaultPalette
