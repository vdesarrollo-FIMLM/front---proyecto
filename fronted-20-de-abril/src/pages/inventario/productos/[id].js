import InventarioLayout from 'src/layouts/InventarioLayout'
import DetalleProductoView from 'src/views/apps/inventario/DetalleProductoView'

const DetalleProductoPage = () => {
  return <DetalleProductoView />
}

DetalleProductoPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
DetalleProductoPage.authGuard = false

export default DetalleProductoPage