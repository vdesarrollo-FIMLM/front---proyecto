import InventarioLayout from 'src/layouts/InventarioLayout'
import ProductosView from 'src/views/apps/inventario/ProductosView'

const ProductosPage = () => {
  return <ProductosView />
}

ProductosPage.getLayout = (page) => <InventarioLayout>{page}</InventarioLayout>
ProductosPage.contentHeightFixed = true
ProductosPage.authGuard = false

export default ProductosPage