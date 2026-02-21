import { useTranslation } from 'react-i18next'

const Navigation = () => {
  const { t } = useTranslation()

  return [
    {
      title: t('Inicio'),
      path: '/home',
      icon: 'mdi:home-outline',
      action: 'home-ver'
    }
  ]
}

export default Navigation
