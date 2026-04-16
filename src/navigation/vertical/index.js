// src/navigation/vertical/index.js

// Definir los items con roles
const getNavigation = (userRole) => {
  const allNavigation = [
    {
      title: 'Dashboard',
      path: '/inventario/dashboard',
      icon: 'mdi:view-dashboard',
      roles: ['super_admin', 'admin']
    },
    {
      title: 'Movimientos',
      path: '/inventario/movimientos',
      icon: 'mdi:swap-horizontal',
      roles: ['super_admin', 'admin']
    },
    {
      title: 'Entradas',
      path: '/inventario/entrada',
      icon: 'mdi:arrow-down-bold',
      roles: ['super_admin', 'operativo']
    },
    {
      title: 'Salidas',
      path: '/inventario/salida',
      icon: 'mdi:arrow-up-bold',
      roles: ['super_admin', 'operativo']
    },
    {
      title: 'Productos',
      path: '/inventario/productos',
      icon: 'mdi:package-variant',
      roles: ['super_admin']
    },
    {
      title: 'Usuarios',
      path: '/inventario/usuarios',
      icon: 'mdi:account-group',
      roles: ['super_admin']
    }
  ]

  // Filtrar según el rol del usuario
  return allNavigation.filter(item => item.roles.includes(userRole))
}

export default getNavigation