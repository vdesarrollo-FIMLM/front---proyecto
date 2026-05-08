import InventarioLayout from 'src/layouts/InventarioLayout'
import CrearProductoView from 'src/views/apps/inventario/CrearProductoView'

const CrearProductoPage = () => {
  return <CrearProductoView />
}

CrearProductoPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
CrearProductoPage.authGuard = false

export default CrearProductoPage