import InventarioLayout from 'src/layouts/InventarioLayout'
import EditarProductoView from 'src/views/apps/inventario/EditarProductoView'

const EditarProductoPage = () => {
  return <EditarProductoView />
}

EditarProductoPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
EditarProductoPage.authGuard = false

export default EditarProductoPage