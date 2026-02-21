import { CircularProgress, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { getImagenesPorTamano } from 'src/api/utilidades'
import VisorArchivosCargados from 'src/components/visor-archivos-cargados/VisorArchivosCargados'

const AdjuntosHistoricos = ({ adjuntos, showTitle = true, downLoadFile = true, showContent = true }) => {
  const [listaArchivosCargados, setListaArchivosCargados] = useState([])
  const [cargandoArchivos, setCargandoArchivos] = useState(false)
  const [idAdjuntosList, setIdAdjuntosList] = useState([])

  useEffect(() => {
    if (adjuntos.length > 0) {
      handleGetArchivosCargados(adjuntos)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGetArchivosCargados = async idAdjuntos => {
    try {
      setCargandoArchivos(true)
      const result = await getImagenesPorTamano(idAdjuntos)
      if (result.status == 200) {
        // Extraer los id_adjunto de cada objeto y almacenarlos en un arreglo
        const ids = result.data.map(item => item.id_adjunto)
        setListaArchivosCargados(result.data)
        setIdAdjuntosList(ids) // Guardamos la lista de IDs
        setCargandoArchivos(false)
      } else {
        setListaArchivosCargados([])
        setIdAdjuntosList([]) // Limpiamos la lista de IDs si falla
        setCargandoArchivos(false)
      }
    } catch (error) {
      setListaArchivosCargados([])
      setIdAdjuntosList([]) // Limpiamos la lista de IDs en caso de error
      setCargandoArchivos(false)
    }
  }

  return (
    <Grid container>
      {cargandoArchivos ? (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {listaArchivosCargados.length > 0 ? (
            <VisorArchivosCargados
              listaArchivos={listaArchivosCargados}
              showTitle={showTitle}
              downLoadFile={downLoadFile}
              showContent={showContent}
            />
          ) : null}
        </>
      )}
    </Grid>
  )
}

export default AdjuntosHistoricos
