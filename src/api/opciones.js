import Api from 'src/configs/axios'

export async function getOpcion(grupo, pais = 'NA', opciones_adicionales = 'NA', variant = 'modificada') {
  try {
    const response = await Api.get(
      'opciones/buscar_opciones?grupo=' +
      grupo +
      '&pais=' +
      pais +
      '&opciones_adicionales=' +
      opciones_adicionales
    )

    if (variant === 'default') {
      return response
    } else if (variant === 'modificada') {
      const optionsFromApi = response.data.map(option => ({
        id: option.id,
        color: option.color || '#808080',
        definicion: option.definicion || '',
        descripcion: option.descripcion || '',
        icono: option.icono || '',
        label: option.label,
        options: option.opciones || [],
        tipo: option.tipo || '',
        value: option.id
      }))

      return optionsFromApi
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getbancos() {
  try {
    const response = await Api.get('bancos/listar')

    const optionsFromApi = response.data.map(option => ({
      value: option._id,
      label: option.nombre
    }))

    return optionsFromApi
  } catch (error) {
    console.error(error)

    return []
  }
}
