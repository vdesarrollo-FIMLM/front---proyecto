import Api from 'src/configs/axios'

export async function getRoles() {
  try {
    const result = await Api.get('roles_permisos/roles')

    return result
  } catch (error) {
    return error
  }
}

export async function AceptarTerminosCondiciones(data, id_tercero) {
  try {
    const result = await Api.put('terceros/aceptar_terminos?id_tercero=' + id_tercero, data)

    return result
  } catch (error) {
    return error
  }
}
