import InventarioLayout from 'src/layouts/InventarioLayout'
import DashboardView from 'src/views/apps/inventario/DashboardView'

const DashboardPage = () => {
  return <DashboardView />
}

DashboardPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
DashboardPage.contentHeightFixed = true
DashboardPage.authGuard = false

export default DashboardPage