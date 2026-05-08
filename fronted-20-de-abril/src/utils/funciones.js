

export function estaVacio(campo) {
  try {
    if (campo == null) {
      return true
    }

    if (typeof campo === 'undefined') {
      return true
    }

    if (typeof campo === 'object') {
      return campo.length === 0
    }

    return !!(campo === '' || campo === null)
  } catch (error) {
    console.log('estaVacio', error)

    return false
  }
}

export function quitarEtiquetasHtml(texto) {
  const regex = /(<([^>]+)>|&nbsp;)/gi
  return texto.replace(regex, '')
}

export function generarRandomId() {
  return Math.random().toString(36).substr(2, 9)
}

export const truncarTexto = (texto, maxLength = 20) => {
  if (texto.length <= maxLength) return texto
  return texto.substring(0, maxLength) + '...'
}

export const truncarMedioNombreArchivo = (fileName, maxLength = 20) => {
  if (fileName.length <= maxLength) return fileName

  const extIndex = fileName.lastIndexOf('.')
  const ext = extIndex !== -1 ? fileName.substring(extIndex) : ''
  const name = extIndex !== -1 ? fileName.substring(0, extIndex) : fileName

  const visibleChars = maxLength - ext.length - 3 // 3 es por "..."
  const start = name.substring(0, Math.ceil(visibleChars / 2))
  const end = name.substring(name.length - Math.floor(visibleChars / 2))

  return `${start}...${end}${ext}`
}