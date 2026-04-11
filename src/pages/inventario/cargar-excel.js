import InventarioLayout from 'src/layouts/InventarioLayout'
import CargarExcelView from 'src/views/apps/inventario/CargarExcelView'

const CargarExcelPage = () => {
  return <CargarExcelView />
}

CargarExcelPage.authGuard = false
CargarExcelPage.acl = {
  action: 'create',
  subject: 'inventario',
  guestGuard: true
}

export default CargarExcelPage