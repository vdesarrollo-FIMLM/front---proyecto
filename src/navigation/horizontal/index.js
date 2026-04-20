const navigation = () => {
  return [
    {
      title: t('Inicio'),
      path: '/home',
      icon: 'mdi:home-outline',
      action: 'home-ver'
    },
    {
      title: t('Módulo'),
      icon: 'mdi:people-group-outline',
      children: [
        {
          title: t('Submódulo'),
          path: '/apps/modulo/submodulo',
          icon: 'bi:search',
          action: 'mostrar-submodulo'
        }
      ]
    }
  ]
}

export default navigation
