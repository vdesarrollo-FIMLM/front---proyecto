import { useState, useEffect } from 'react'
import { getArchivosBase64, getImagenesPorTamano, obtenerArchivoPorId } from 'src/api/utilidades'

const mime_types = {
  // images
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',

  // Video
  mov: 'video/quicktime',
  flv: 'video/x-flv',
  mp4: 'video/mp4',
  mpg: 'video/mpeg',
  mpeg: 'video/mpeg',
  wmv: 'video/x-ms-wmv',

  // Application
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12'
}

const useArchivosCargados = (adjuntos, api) => {
  const [listaImagenes64, setListaImagenes64] = useState([])
  const [loading, setLoading] = useState(false)
  const [abrirVistaPreviaModal, setAbrirVistaPreviaModal] = useState(false)
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const [descargandoArchivo, setDescargandoArchivo] = useState(Array(listaImagenes64.length).fill(false))

  useEffect(() => {
    if (adjuntos.length > 0 && api == 'minio') {
      handleGetImagenes(adjuntos)
    } else if (adjuntos.length > 0 && api == 'gcs') {
      handleGetArchivosGCS(adjuntos)
    }
  }, [])

  const handleGetImagenes = async idAdjuntos => {
    try {
      setLoading(true)
      const result = await getImagenesPorTamano(idAdjuntos)

      if (result.status === 200) {
        setListaImagenes64(result.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetArchivosGCS = async idAdjuntos => {
    try {
      setLoading(true)
      const archivosPromises = idAdjuntos.map(async idAdjunto => {
        const result = await obtenerArchivoPorId(idAdjunto)

        if (result.status === 200) {
          const data = result.data
          return {
            id_adjunto: data?.id_archivo,
            nombre_original: data?.nombre_original,
            extension: data?.extension,
            peso_imagen: data?.peso_archivo,
            imagen: data?.archivo
          }
        }
        return null
      })

      const archivos = await Promise.all(archivosPromises)
      const archivosFiltrados = archivos.filter(archivo => archivo !== null)

      setListaImagenes64(setLista => [...setLista, ...archivosFiltrados])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAbrirVistaPreviaModal = () => {
    if (setAbrirVistaPreviaModal) {
      setAbrirVistaPreviaModal(false)
      setArchivoSeleccionado(false)
    } else {
      setAbrirVistaPreviaModal(true)
    }
  }

  const handleVerVistaPrevia = archivo => {
    const tipo = mime_types[`${archivo.extension.slice(1)}`]
    setArchivoSeleccionado({ archivo: archivo.imagen, mimeType: tipo })
    setAbrirVistaPreviaModal(true)
  }

  const handleDescargarArchivo = async (idAdjunto, index, event) => {
    try {
      event.stopPropagation()

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

      setDescargandoArchivo(Array(listaImagenes64.length).fill(false))
    } catch (error) {
      console.error(error)
      setDescargandoArchivo(Array(listaImagenes64.length).fill(false))
    }
  }

  return {
    listaImagenes64,
    loading,
    abrirVistaPreviaModal,
    archivoSeleccionado,
    setArchivoSeleccionado,
    setAbrirVistaPreviaModal,
    handleAbrirVistaPreviaModal,
    handleVerVistaPrevia,
    handleDescargarArchivo,
    descargandoArchivo
  }
}

export { useArchivosCargados }
