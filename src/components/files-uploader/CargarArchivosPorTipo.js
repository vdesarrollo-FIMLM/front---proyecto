// ** React Imports
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Stack } from '@mui/material'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import BackupTwoToneIcon from '@mui/icons-material/BackupTwoTone'

// ** Core Imports
import Icon from 'src/@core/components/icon'

// ** Sweet Alert Imports
import Swal from 'sweetalert2'

const CargaArchivosPorTipo = ({ getListaArchivos, setListaArchivos, maxFiles, typeFiles }) => {
  // let maxFiles = 20 // Cambiar la cantidad máxima de archivos permitidos aquí, ya está automatizado

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [openImageModal, setOpenImageModal] = useState(false) // Estado para abrir y cerrar el modal de imagen
  const [previewImage, setPreviewImage] = useState(null) // Estado para almacenar la imagen en vista previa

  const [openPdfModal, setOpenPdfModal] = useState(false) // Estado para abrir y cerrar el modal de pdf
  const [previewPdf, setPreviewPdf] = useState(null)

  const [files, setFiles] = useState(setListaArchivos.length !== 0 ? setListaArchivos : []) // Lista de archivos seleccionados

  // Convierte el objeto typeFiles en un array plano de extensiones permitidas
  const allowedExtensions = Object.values(typeFiles).flat()

  // Manejador de evento que se activa cuando se suelta un archivo en el área de drop
  const handleDrop = acceptedFiles => {
    const updatedFiles = [...files]

    // Verificar si la cantidad de archivos existentes más los archivos aceptados supera el límite máximo
    if (updatedFiles.length + acceptedFiles.length > maxFiles) {
      Swal.fire('Advertencia', `No puedes subir más de ${maxFiles} archivos`, 'warning')

      return
    }

    // Iterar sobre los archivos aceptados
    acceptedFiles.forEach(file => {
      //   Verificar si el tipo de archivo es permitido

      const fileMimeType = file.type

      // Obtiene la extensión del archivo
      const fileExtension = `.${file.name.split('.').pop()}`
      console.log(fileExtension)
      console.log(allowedExtensions)

      if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Este tipo de archivo no es admitido',
          customClass: {
            container: 'my-sweetalert-container'
          }
        })

        return
      }

      // Buscar el índice del archivo existente en la lista de archivos
      const existingFileIndex = updatedFiles.findIndex(f => f.name === file.name)

      // Verificar si el archivo ya existe en la lista
      if (existingFileIndex !== -1) {
        Swal.fire('Advertencia', `El archivo ${file.name} ya existe`, 'question')
      } else {
        // Agregar el archivo a la lista de archivos actualizada
        updatedFiles.push(file)
      }
    })

    // Actualizar el estado de los archivos
    setFiles(updatedFiles)

    // Obtener la lista de archivos
    getListaArchivos(updatedFiles)
  }

  // Manejador de evento que se activa cuando se desea eliminar un archivo
  const handleRemoveFile = file => {
    // Filtrar la lista de archivos para excluir el archivo seleccionado
    const updatedFiles = files.filter(f => f.name !== file.name)

    // Actualizar el estado de los archivos
    setFiles(updatedFiles)

    // Obtener la lista de archivos actualizada
    getListaArchivos(updatedFiles)
  }

  // Manejador de evento que permite visualizar la imagen, y abre el modal
  const handlePreviewImage = file => {
    setPreviewImage(URL.createObjectURL(file))
    setOpenImageModal(true)
  }

  // Manejador de evento que permite cerrar el modal que visualiza la imagen
  const handleCloseImageModal = () => {
    setOpenImageModal(false)
    setPreviewImage(null)
  }

  // Manejador de evento que permite visualizar el pdf, y abre el modal
  // const handlePreviewPdf = file => {
  //   setPreviewPdf(URL.createObjectURL(file))
  //   setOpenPdfModal(true)
  // }

  const handlePreviewPdf = file => {
    setPreviewPdf(URL.createObjectURL(file))
    setOpenPdfModal(true)
  }

  // Manejador de evento que permite cerrar el modal que visualiza el pdf
  const handleClosePdfModal = () => {
    setOpenPdfModal(false)
    setPreviewPdf(null)
  }

  // Obtener las propiedades del área de drop y del input para el componente useDropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop, // Función de devolución de llamada para el evento onDrop
    accept: typeFiles, // Tipos de archivo aceptados
    maxFiles: maxFiles // Limitar la cantidad máxima de archivos
  })

  // Variable que almacena una lista de elementos de archivo renderizados en el componente de lista de archivos
  const fileList = files.map(file => (
    <Grid item key={file.name} xs={12} sm={6} md={4} lg={3}>
      <Card
        className='hovered'
        style={{
          boxShadow: '8px 6px 18px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        {/* Vista previa de la imagen */}
        <CardMedia
          component='img'
          alt='Preview'
          height='120'
          image={URL.createObjectURL(file)}
          onClick={() => handlePreviewImage(file)}
          style={{
            cursor: 'pointer'
          }}
        />

        {/* Contenido de la card */}
        <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant='subtitle1'>
              {file.name.substring(0, file.name.lastIndexOf('.'))} {/* Nombre del archivo */}
            </Typography>
            {/* Conversión del tamaño del archivo */}
            <Typography variant='body2' color='textSecondary'>
              {Math.round(file.size / 100) / 10 > 1000
                ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mB`
                : `${(Math.round(file.size / 100) / 10).toFixed(1)} kB`}
            </Typography>
          </div>
          {/* icono de X */}
          <IconButton
            variant='outlined'
            color='error'
            onClick={() => handleRemoveFile(file)}
            style={{
              color: 'white',
              position: 'absolute',
              top: 5,
              right: 5,
              borderRadius: '100%',
              backgroundColor: '#DC3545'
            }}
          >
            <Icon icon='mdi:close' fontSize={16} />
          </IconButton>
        </CardContent>
      </Card>
    </Grid>
  ))

  // Función para eliminar todos los archivos seleccionados. Establece el estado de los archivos en una lista vacía y llama a la función getListaArchivos con una lista vacía como argumento.
  const handleRemoveAllFiles = () => {
    setFiles([])
    getListaArchivos([])
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <div // Estilo de la caja de arrastre y carga de archivos
        {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''}` })}
        style={{
          border: '2px dashed #999',
          padding: '20px',
          borderRadius: '5px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <input {...getInputProps()} />
        {/* Icono que está dentro de la carga de archivos */}
        <BackupTwoToneIcon
          sx={{ width: 150, height: 100 }}
          alt='none'
          color='info'
          style={{
            margin: '0 auto',
            pointerEvents: 'none',
            cursor: 'default'
          }}
        />
        {/* Textos de la carga de archivos */}
        <Grid style={{ marginTop: '10px' }}>
          <Typography color='textSecondary'>
            Arrastre los archivos aquí o haga clic para navegar en su dispositivo
          </Typography>
          <Typography color='textSecondary'>Máximo {maxFiles} archivos</Typography>
        </Grid>
      </div>
      {/* Validación que muestra la cantidad de archivos cargados */}
      {files.length ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}
        >
          <Typography variant='body1' color='textSecondary'>
            Archivos cargados: {files.length}
          </Typography>
          {/* Validación que muestra el botón de eliminar todos los archivos cargados */}
          {files.length > 1 && (
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={isMobile ? 1 : 2}
              justifyContent='flex-start'
              alignItems='center'
              className='buttons'
              sx={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              <Button
                style={{
                  color: '#ff0000',
                  borderColor: '#ff0000',
                  borderWidth: '2px',
                  fontSize: isMobile ? '14px' : '17px'
                }}
                variant='outlined'
                onClick={handleRemoveAllFiles}
              >
                Remover todos
              </Button>
            </Stack>
          )}
        </Box>
      ) : null}
      {/* Contenedor que carga los archivos cargados */}
      <Grid container spacing={2}>
        {fileList}
      </Grid>
      {/* Modal que permite visualizar la imagen */}
      <Modal open={openImageModal} onClose={handleCloseImageModal} closeAfterTransition>
        <Fade in={openImageModal}>
          <div // Estilo que se le da a la vista previa de imagen
            onClick={handleCloseImageModal} // Agregar el evento de clic para cerrar la vista previa
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
              onClick={handleCloseImageModal}
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
              <img
                src={previewImage}
                alt='Preview'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </Fade>
      </Modal>

      <style>
        {`
        .my-sweetalert-container {
          z-index: 4000
        }
        `}
      </style>
    </Box>
  )
}

CargaArchivosPorTipo.defaultProps = {
  maxFiles: 20,
  typeFiles: ['image/*']
}

export default CargaArchivosPorTipo
