import InventarioLayout from 'src/layouts/InventarioLayout'
import EscanerView from 'src/views/apps/inventario/EscanerView'

const EscanearPage = () => {
  return <EscanerView />
}

EscanearPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
EscanearPage.contentHeightFixed = true
EscanearPage.authGuard = false

export default EscanearPage