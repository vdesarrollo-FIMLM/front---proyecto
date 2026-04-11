import InventarioLayout from 'src/layouts/InventarioLayout'
import MovimientosView from 'src/views/apps/inventario/MovimientosView'

const MovimientosPage = () => {
  return <MovimientosView />
}

MovimientosPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
MovimientosPage.contentHeightFixed = true
MovimientosPage.authGuard = false

export default MovimientosPage