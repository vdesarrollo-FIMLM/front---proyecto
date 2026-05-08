import React, { useEffect, useState } from 'react'
import { getArchivosBase64, getImagenesPorTamano } from 'src/api/utilidades'
import { EXTENSIONES_AUDIO, EXTENSIONES_VIDEO } from 'src/utils/constantes'
import { getArchivosVideos } from 'src/utils/funciones'

const mime_types = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  pdf: 'application/pdf'
}

const useVisualizadorArchivos = (adjuntos, previewPdf) => {
  const [loading, setLoading] = useState(false)
  const [listaArchivos, setListaArchivos] = useState([])

  useEffect(() => {
    if (adjuntos.length > 0) {
      setListaArchivos(adjuntos)

      //handleGetArchivos(adjuntos)
      handleGetArchivosBatch(adjuntos)
    }
  }, [])

  const handleGetArchivosBatch = async idAdjuntos => {
    try {
      setLoading(true)

      // Separa videos de imágenes
      const videos = getArchivosVideos(idAdjuntos)
      let otrosArchivos = getArchivosVideos(idAdjuntos, false)

      // Lista inicial con los archivos sin imagen
      setListaArchivos([...otrosArchivos, ...videos])

      if (!previewPdf) {
        otrosArchivos = otrosArchivos.filter(archivo => !['.pdf'].includes(archivo.extension))
      }

      const idsOtrosArchivos = otrosArchivos.map(archivo => archivo.id_adjunto)
      const batchSize = 2 // Tamaño del lote

      for (let i = 0; i < idsOtrosArchivos.length; i += batchSize) {
        const batchIds = idsOtrosArchivos.slice(i, i + batchSize)

        try {
          const result = await getImagenesPorTamano(batchIds)

          if (result.status === 200) {
            setListaArchivos(prevArchivos => {
              return prevArchivos.map(archivo => {
                // Buscar si el archivo actual tiene una versión con imagen descargada
                const archivoDescargado = result.data.find(a => a.id_adjunto === archivo.id_adjunto)
                return archivoDescargado ? { ...archivo, ...archivoDescargado } : archivo
              })
            })
          }
        } catch (error) {
          console.error(`Error al cargar imágenes para IDs ${batchIds}:`, error)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetArchivos = async idAdjuntos => {
    try {
      setLoading(true)

      //Filtra solo los que son videos
      const videos = getArchivosVideos(idAdjuntos)
      const otrosArchivos = getArchivosVideos(idAdjuntos, false)

      const idsOtrosArchivos = otrosArchivos.map(archivo => archivo.id_adjunto)

      const result = await getImagenesPorTamano(idsOtrosArchivos)

      if (result.status === 200) {
        setListaArchivos([...result.data, ...videos])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOnClickMenuOption = (archivo, accion) => {
    try {
      if (accion == 'descargar') {
        handleDescargarArchivo(archivo)
      } else if (accion == 'link') {
        const extension = archivo?.nombre_original?.split('.').pop()
        return obtenerLink(archivo, extension)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerLink = (archivo, extension) => {
    if (['.bmp', '.jpg', '.jpeg', '.png', 'bmp', 'jpg', 'jpeg', 'png'].includes(extension)) {
      return `/proxy/streaming/${archivo.id_adjunto}/file/?ext=${extension}&type=image`
    } else if (EXTENSIONES_VIDEO.includes(extension)) {
      return `/proxy/streaming/${archivo.id_adjunto}/file/?ext=${extension}&type=video`
    } else if (EXTENSIONES_AUDIO.includes(extension)) {
      return `/proxy/streaming/${archivo.id_adjunto}/file/?ext=${extension}&type=audio`
    } else if (['.pdf', 'pdf'].includes(extension)) {
      return `/proxy/streaming/${archivo.id_adjunto}/file/?ext=${extension}&type=pdf#toolbar=0&navpanes=0&scrollbar=0&page=1`
    }
  }

  const handleDescargarArchivo = async archivo => {
    try {
      const result = await getArchivosBase64(archivo.id_adjunto)

      const link = document.createElement('a')
      link.href = result.url
      link.download = archivo?.nombre_original || `adjunto${result.extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      //setDescargandoArchivo(Array(listaImagenes64.length).fill(false))
    } catch (error) {
      console.error(error)
      ///setDescargandoArchivo(Array(listaImagenes64.length).fill(false))
    }
  }

  return {
    loading,
    listaArchivos,
    handleOnClickMenuOption
  }
}

export { useVisualizadorArchivos }
