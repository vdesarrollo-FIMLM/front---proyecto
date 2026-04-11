const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline',
    },
    {
  title: 'Inventario',
  icon: 'mdi:package-variant-closed',
  children: [
    { title: 'Dashboard', path: '/inventario/dashboard' },
    { title: 'Productos', path: '/inventario/productos' },
    { title: 'Entrada', path: '/inventario/entrada' },
    { title: 'Salida', path: '/inventario/salida' },
    { title: 'Movimientos', path: '/inventario/movimientos' },
    { title: 'Escanear QR', path: '/inventario/escanear' }, 
    { title: 'Cargar Excel', path: '/inventario/cargar-excel' }
  ]
},
    // ... resto del menú existente
  ]
}