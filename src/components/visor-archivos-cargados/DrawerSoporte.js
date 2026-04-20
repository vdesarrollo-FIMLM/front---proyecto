import { useState, useEffect } from 'react'

import { Drawer, IconButton, Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material'

import Icon from 'src/@core/components/icon'
import { getImagenesPorTamano } from 'src/api/utilidades'

const mime_types = {
  // images
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',

  // Application
  pdf: 'application/pdf'
}

const DrawerSoporte = ({ id_adjunto, openDrawer, setOpenDrawer }) => {
  const [cargandoArchivos, setCargandoArchivos] = useState(true)

  const [dataArchivo, setDataArchivo] = useState(null)

  const [urlPdf, setUrlPdf] = useState(null)

  useEffect(() => {
    handleGetArchivosCargados([id_adjunto])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_adjunto])

  const handleGetArchivosCargados = async idAdjuntos => {
    try {
      setCargandoArchivos(true)
      const result = await getImagenesPorTamano(idAdjuntos)

      if (result.status == 200) {
        const dataFile = { ...result.data[0], mime_type: mime_types[`${result.data[0].extension.slice(1)}`] }

        if (result.data[0].extension == '.pdf' || result.data[0].extension == '.PDF') {
          setUrlPdf(URL.createObjectURL(base64ToBlob(dataFile.imagen, 'application/pdf')))
        }

        setDataArchivo(dataFile)
      } else {
        setDataArchivo(null)
      }

      // setListaArchivosCargados(result.data)
      setCargandoArchivos(false)
    } catch (error) {}
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

  const tipoVisor = archivo => {
    if (archivo.mime_type == 'application/pdf') {
      return (
        <iframe
          src={urlPdf}
          title='Preview PDF'
          style={{
            width: '100%',
            height: '90vh'
          }}
        />
      )
    } else {
      return (
        <img
          src={`data:${archivo.mime_type};base64,${archivo.imagen}`}
          alt='Preview'
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      )
    }
  }

  return (
    <Drawer
      variant='persistent'
      anchor='right'
      open={openDrawer}
      style={{ width: 580 }}
      ModalProps={{
        keepMounted: true // Better open performance on mobile.
      }}
    >
      <Card sx={{ width: 580, height: '100vh' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'end', mb: 3 }}>
          <IconButton
            size='small'
            onClick={() => setOpenDrawer(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            color='error'
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </CardContent>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
          {cargandoArchivos ? (
            <Grid item xs={12} md={12} lg={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress sx={{ mb: 4 }} />
                <Typography>Cargando...</Typography>
              </Box>
            </Grid>
          ) : (
            tipoVisor(dataArchivo)
          )}
        </CardContent>
      </Card>
    </Drawer>
  )
}

export default DrawerSoporte
