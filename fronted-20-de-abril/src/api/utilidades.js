import Api from 'src/configs/axios'

export async function getLabores() {
  try {
    const result = await Api.get('labores')

    return result
  } catch (error) {
    return error
  }
}

export async function guardarArchivosGCS(archivos, subcarpeta_destino, modulo, tipo, encriptar = false) {
  const dataFile = new FormData()

  try {
    dataFile.append('subcarpeta_destino', subcarpeta_destino)
    dataFile.append('modulo', modulo)
    dataFile.append('tipo', tipo)

    for (const archivo of archivos) {
      dataFile.append('archivo', archivo)
    }

    const result = await Api.post('archivos/cargar', dataFile)

    return result
  } catch (error) {
    return error
  }
}

export async function getArchivos(tokenArchivo) {
  try {
    const response = await Api.get(`archivos/ver/${tokenArchivo}`)

    return response
  } catch (error) {
    return error
  }
}

/**
 * Obtiene una imagen en base64
 * (los parámetros alto/ancho se mantienen en la firma
 * para no romper llamadas existentes, pero ya no se usan)
 */
export async function getImagen(tokenArchivo, alto, ancho) {
  try {
    const response = await Api.get(`archivos/ver/${tokenArchivo}`, { responseType: 'arraybuffer' })

    if (response.status !== 200) {
      return ''
    }

    // 1) detectar tipo MIME
    const mime = 'image/jpeg'
    // 2) convertir a base64
    const base64 = Buffer.from(response.data, 'binary').toString('base64')
    // 3) devolver data URI completo
    return `data:${mime};base64,${base64}`
  } catch (error) {
    return error
  }
}

export async function generarUrlArchivo(adjunto) {
  const mime_types = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',

    pdf: 'application/pdf'
  }

  try {
    const response = await Api.get(`archivos/ver/${adjunto}`)

    if (response.status !== 200 || response.data.length === 0) {
      throw new Error('No se encontró el archivo')
    }

    const content = response.data.extension.slice(1) // e.g. ".pdf" -> "pdf"
    const blob = base64ToBlob(response.data.archivo, mime_types[content.toLowerCase()])
    const fileUrl = URL.createObjectURL(blob)

    return fileUrl
  } catch (error) {
    console.error('Error fetching image', error)

    return 'error'
  }
}

const base64ToBlob = (base64Data, contentType) => {
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

  const blob = new Blob(byteArrays, { type: contentType })

  return blob
}

export async function getImagenesPorTamano(idAdjuntos, ancho = null, alto = null) {
  try {
    let adjuntos = ''
    for (let i = 0; i < idAdjuntos.length; i++) {
      if (i == idAdjuntos.length - 1) {
        adjuntos += `adjuntos=${idAdjuntos[i]}`
      } else {
        adjuntos += `adjuntos=${idAdjuntos[i]}&`
      }
    }

    if (ancho == null || alto == null) {
      const result = await Api.get(`archivos/buscar_imagenes?${adjuntos}`)

      return result
    } else {
      const result = await Api.get(`archivos/buscar_imagenes?${adjuntos}&ancho=${ancho}&alto=${alto}`)

      return result
    }
  } catch (error) {
    return error
  }
}
