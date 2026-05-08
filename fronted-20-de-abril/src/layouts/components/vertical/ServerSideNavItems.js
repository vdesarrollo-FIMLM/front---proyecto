import Api from 'src/configs/axios'

export async function ServerSideNavItems(menu) {
  try {
    if (!menu) return []

    const result = await Api.get('menu_vertical/obtener?menu=' + menu)
    return result
  } catch (error) {
    return error
  }
}
