import InventarioLayout from 'src/layouts/InventarioLayout'
import SalidaView from 'src/views/apps/inventario/SalidaView'

const SalidaPage = () => {
  return <SalidaView />
}

SalidaPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
SalidaPage.contentHeightFixed = true
SalidaPage.authGuard = false

export default SalidaPage