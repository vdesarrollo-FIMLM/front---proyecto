import HomeInicio from 'src/views/apps/home/Home'

const IndexHome = () => {
  return <HomeInicio />
}

// 🔥 Temporalmente desactivar autenticación
IndexHome.authGuard = false
IndexHome.guestGuard = true

IndexHome.acl = {
  action: 'home-ver',
  guestGuard: true
}

export default IndexHome