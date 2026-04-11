import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Layout from 'src/@core/layouts/Layout'
import VerticalNavItems from 'src/navigation/vertical'
import { ServerSideNavItems } from './components/vertical/ServerSideNavItems'
import HorizontalNavItems from 'src/navigation/horizontal'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useEffect, useState } from 'react'
import CustomNavbar from './components/CustomNavbar' // ← Nuevo componente
import CustomFooter from './components/CustomFooter' // ← Nuevo componente

const UserLayout = ({ children, contentHeightFixed }) => {
  const { settings, saveSettings } = useSettings()
  const [menuItems, setMenuItems] = useState([])
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {
    handleMenuItem()
  }, [settings.themeColor])

  const handleMenuItem = async () => {
    const menuMap = { home_economico: 'economico' }
    const result = await ServerSideNavItems(menuMap[settings.themeColor] || null)
    setMenuItems(result.status === 200 ? result.data?.menu || [] : [])
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: menuItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems()
          },
          appBar: {
            content: () => <HorizontalAppBarContent settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {/* Tu contenido personalizado con navbar y footer */}
      <CustomNavbar />
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
      <CustomFooter />
    </Layout>
  )
}

export default UserLayout