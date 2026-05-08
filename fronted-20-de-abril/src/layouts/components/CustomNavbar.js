import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Badge
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Inventory as BoxIcon,
  QrCodeScanner as CameraIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  History as HistoryIcon,
  Circle as CircleIcon
} from '@mui/icons-material'
import { useServerStatus } from 'src/hooks/useServerStatus'

const CustomNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { status } = useServerStatus()

const menuItems = [
  { path: '/inventario/dashboard', label: 'Inicio', icon: HomeIcon },
  { path: '/inventario/productos', label: 'Productos', icon: BoxIcon },
  { path: '/inventario/escanear', label: 'Escanear', icon: CameraIcon, highlight: true },
  { path: '/inventario/entrada', label: 'Entrada', icon: ArrowDownIcon },
  { path: '/inventario/salida', label: 'Salida', icon: ArrowUpIcon },
  { path: '/inventario/movimientos', label: 'Movimientos', icon: HistoryIcon }
]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = router.pathname === item.path
          
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive}
                sx={{
                  backgroundColor: item.highlight && !isActive ? 'primary.main' : 'transparent',
                  color: item.highlight && !isActive ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: item.highlight ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                <ListItemIcon sx={{ color: item.highlight && !isActive ? 'white' : 'inherit' }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Link href="/" passHref style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ fontSize: '1.75rem', color: 'primary.main' }}>📦</Box>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Inventario FIMLM
                </Typography>
              </Box>
            </Link>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = router.pathname === item.path
                
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    href={item.path}
                    startIcon={<Icon />}
                    variant={item.highlight ? 'contained' : isActive ? 'outlined' : 'text'}
                    color={item.highlight ? 'primary' : 'inherit'}
                    sx={{
                      color: item.highlight ? 'white' : isActive ? 'primary.main' : 'text.secondary',
                      backgroundColor: item.highlight ? 'primary.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: item.highlight ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              variant="dot"
              color={status === 'online' ? 'success' : status === 'offline' ? 'error' : 'warning'}
            >
              <Typography variant="body2" color="text.secondary">
                {status === 'online' ? 'Conectado' : status === 'offline' ? 'Desconectado' : 'Verificando...'}
              </Typography>
            </Badge>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default CustomNavbar