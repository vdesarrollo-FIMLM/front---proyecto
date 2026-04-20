import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

const InventarioLayout = ({ children }) => {
  const router = useRouter()
  
  const menuItems = [
    { path: '/inventario/dashboard', label: 'Dashboard' },
    { path: '/inventario/productos', label: 'Productos' },
    { path: '/inventario/entrada', label: 'Entrada' },
    { path: '/inventario/salida', label: 'Salida' },
    { path: '/inventario/movimientos', label: 'Movimientos' },
    { path: '/inventario/escanear', label: 'Escanear' }
  ]
  
  const isActive = (path) => router.pathname === path
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventario FIMLM
          </Typography>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              href={item.path}
              sx={{
                bgcolor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              {item.label}
            </Button>
          ))}
          <UserDropdown />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}

export default InventarioLayout