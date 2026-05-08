import { useEffect, useState } from 'react'
import { Box, CircularProgress, Fade, Grid, IconButton, Modal, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { getImagenesPorTamano } from 'src/api/utilidades'
import { useTranslation } from 'react-i18next'
import { Document, Page, pdfjs } from 'react-pdf'

// Configura el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs'

const VisorArchivosProtegidos = ({ id_adjunto, abrirModal, handleVistaPrevia }) => {
  const [tipoArchivo, setTipoArchivo] = useState(null)
  const [base64, setBase64] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)

  const { t } = useTranslation()

  const mime_types = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    pdf: 'application/pdf'
  }

  useEffect(() => {
    let isMounted = true

    const style = document.createElement('style')

    setLoading(true)

    const fetchData = async () => {
      const obtenerImagen = async id => {
        const result = await getImagenesPorTamano([id])
        if (isMounted) {
          setBase64(result.data[0].imagen)
          setTipoArchivo(result.data[0].extension)

          style.textContent = `
        @media print {
          .no-print {
            display: none !important;
          }
        }`

          if (result.data[0].extension !== '.pdf') {
            style.textContent += `
          .modal-size {
            background-image: url('data:image/jpeg;base64,${result.data[0].imagen}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            width: 100%;
            height: 100%;
          }`
          }

          document.head.appendChild(style)
        }
      }

      try {
        await obtenerImagen(id_adjunto)

        setLoading(false)
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      }
    }

    fetchData()

    return () => {
      // document.head.removeChild(style)
      isMounted = false
    }
  }, [id_adjunto])

  useEffect(() => {
    let fileUrl

    if (base64 && tipoArchivo) {
      const file2 = base64ToBlob(base64, mime_types[tipoArchivo.slice(1).toLowerCase()])
      fileUrl = URL.createObjectURL(file2)
    }

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl)
      }
    }
  }, [base64, tipoArchivo])

  const calculateWidth = () => {
    return window.innerWidth >= 1024 ? window.innerWidth * 0.7 : window.innerWidth * 0.9
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

    return new Blob(byteArrays, { type: contentType })
  }

  const renderContenido = () => {
    if (!tipoArchivo || !base64) return null

    const file2 = base64ToBlob(base64, mime_types[tipoArchivo.slice(1).toLowerCase()])
    const fileUrl = URL.createObjectURL(file2)

    if (tipoArchivo === '.pdf') {
      return (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '10px',
              position: 'absolute',
              top: 0
            }}
          >
            <button
              style={{ height: 30, width: 70, display: pageNumber <= 1 ? 'none' : 'block', cursor: 'pointer' }}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              {t('Anterior')}
            </button>
            <p style={{ marginLeft: 10, marginRight: 10 }}>
              {pageNumber} / {numPages}
            </p>
            <button
              style={{ height: 30, width: 70, display: pageNumber >= numPages ? 'none' : 'block', cursor: 'pointer' }}
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              {t('Siguiente')}
            </button>
          </div>
          <Box
            style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              maxHeight: '85vh',
              overflow: 'auto'
            }}
          >
            <Document
              viewer='canvas'
              file={fileUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={error => console.error('Error al cargar el PDF:', error)}
            >
              <Page
                width={calculateWidth()}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                pageNumber={pageNumber}
              />
            </Document>
          </Box>
        </>
      )
    } else {
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              backgroundImage: `url('data:${mime_types[tipoArchivo.slice(1).toLowerCase()]};base64,${base64}')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%'
            }}
          ></div>
        </div>
      )
    }
  }

  return (
    <Modal open={abrirModal} onClose={() => handleVistaPrevia(false)} closeAfterTransition className='no-print'>
      <Fade in={abrirModal}>
        {loading ? (
          <Grid item xs={12} md={12} lg={12}>
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>{`${t('Cargando')}...`}</Typography>
            </Box>
          </Grid>
        ) : (
          <div
            onContextMenu={e => e.preventDefault()}
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.96)',
              zIndex: '999'
            }}
          >
            <IconButton
              onClick={() => handleVistaPrevia(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                color: '#fff',
                backgroundColor: '#DC3545',
                borderRadius: '50%',
                zIndex: '9999',
                width: '40px',
                height: '40px'
              }}
            >
              <Icon icon='mdi:close' fontSize={30} />
            </IconButton>

            <div
              style={{
                minWidth: '90%',
                maxHeight: '90%',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maginTop: '60px'
              }}
            >
              {renderContenido()}
            </div>
          </div>
        )}
      </Fade>
    </Modal>
  )
}

export default VisorArchivosProtegidos
