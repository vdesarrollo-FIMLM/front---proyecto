import { useEffect } from 'react'
import ListaArchivosCargados from './ListaArchivosCargados'
import { useArchivosCargados } from './useArchivosCargados'
import { Button, CircularProgress, Grid } from '@mui/material'
import VistaPreviaArchivo from '../VistaPreviaArchivo'

/**
 * Componente para mostrar archivos cargados
 * @param {Array} adjuntos Array de id adjuntos (default: [])
 * @param {string} variant Tipo de vista (default: 'miniatura')
 * @param {number} width width para la vista (default: 150)
 * @param {number} height weight para la vista (default: 150)
 * @param {string} api Tipo de API a utilizar ('minio' o 'gcs', default: 'minio')
 * @returns
 */
const ArchivosCargados = props => {
  const {
    adjuntos,
    variant = 'miniatura',
    width = 150,
    height = 150,
    styles,
    mostrarHover = true,
    api = 'minio'
  } = props

  const {
    listaImagenes64,
    loading,
    archivoSeleccionado,
    abrirVistaPreviaModal,
    handleAbrirVistaPreviaModal,
    handleVerVistaPrevia,
    handleDescargarArchivo,
    descargandoArchivo
  } = useArchivosCargados(adjuntos, api)

  return (
    <>
      {!loading && (
        <>
          <ListaArchivosCargados
            listaArchivos={listaImagenes64}
            handleVerVistaPrevia={handleVerVistaPrevia}
            handleDescargarArchivo={handleDescargarArchivo}
            descargandoArchivo={descargandoArchivo}
            variant={variant}
            height={width}
            width={height}
            styles={styles}
            mostrarHover={mostrarHover}
          />
          {archivoSeleccionado !== null ? (
            <VistaPreviaArchivo
              abrirModal={abrirVistaPreviaModal}
              handleVistaPrevia={handleAbrirVistaPreviaModal}
              archivo={archivoSeleccionado}
            />
          ) : null}
        </>
      )}

      {loading && (
        <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Grid>
      )}
    </>
  )
}

export default ArchivosCargados
