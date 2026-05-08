import { Box, Container, Typography, Link as MuiLink, Chip } from '@mui/material'
import Link from 'next/link'
import { useServerStatus } from 'src/hooks/useServerStatus'
import { Circle as CircleIcon } from '@mui/icons-material'

const CustomFooter = () => {
  const { status } = useServerStatus()

  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          Sistema de Inventario FIMLM v1.0 &copy; 2026
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, alignItems: 'center' }}>
          <MuiLink href="/api/docs" target="_blank" color="grey.400" underline="hover">
            API Docs
          </MuiLink>
          <Typography color="grey.600">|</Typography>
          <MuiLink href="/api/redoc" target="_blank" color="grey.400" underline="hover">
            ReDoc
          </MuiLink>
          <Typography color="grey.600">|</Typography>
          <Chip
            icon={<CircleIcon sx={{ fontSize: 12 }} />}
            label={status === 'online' ? 'Online' : 'Offline'}
            size="small"
            sx={{
              bgcolor: status === 'online' ? 'success.main' : 'error.main',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        </Box>
      </Container>
    </Box>
  )
}

export default CustomFooter