import { useEffect, useState } from 'react'
import { Fade, IconButton, Modal } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const videosMimeTypes = ['video/quicktime', 'video/x-flv', 'video/mp4', 'video/mpeg', 'video/mpeg', 'video/x-ms-wmv']
const imagenesMimeTypes = ['image/png', 'image/jpeg', 'image/jpeg']

const ModalArchivo = ({ abrirModal, handleVistaPrevia, archivo }) => {
  const [cargandoVista, setCargandoVista] = useState(false)

  useEffect(() => {
    tipoVisor(archivo)
  }, [])

  const tipoVisor = archivo => {
    if (videosMimeTypes.includes(archivo.mimeType)) {
      return (
        <video controls width='500' height='auto'>
          <source src={`data:${archivo.mimeType};base64,${archivo.archivo}`} />
        </video>
      )
    } else if (imagenesMimeTypes.includes(archivo.mimeType)) {
      return (
        <img
          src={`data:${archivo.mimeType};base64,${archivo.archivo}`}
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
    } else if (archivo.mimeType == 'application/pdf') {
      const urlPdf = URL.createObjectURL(base64ToBlob(archivo.archivo, 'application/pdf'))

      return (
        <iframe
          src={urlPdf}
          title='Preview PDF'
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      )
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

  return (
    <Modal open={abrirModal} onClose={handleVistaPrevia} closeAfterTransition>
      <Fade in={abrirModal}>
        <div // Estilo que se le da a la vista previa de imagen
          onClick={handleVistaPrevia} // Agregar el evento de clic para cerrar la vista previa
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
          {/* Icono de X que se muestra en la vista previa de la imagen */}
          <IconButton
            onClick={handleVistaPrevia}
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
              maxWidth: '90%',
              maxHeight: '90%',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {archivo ? tipoVisor(archivo) : null}
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default ModalArchivo
