import InventarioLayout from 'src/layouts/InventarioLayout'
import EntradaView from 'src/views/apps/inventario/EntradaView'

const EntradaPage = () => {
  return <EntradaView />
}

EntradaPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
EntradaPage.contentHeightFixed = true
EntradaPage.authGuard = false

export default EntradaPage