// src/pages/login.js
import { useState } from 'react'
import { Box, Button, TextField, Typography, Paper, Alert, Container, CircularProgress } from '@mui/material'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('accessToken', data.access_token)
        // Redirigir según el rol
        if (data.user.rol === 'super_admin') {
          window.location.href = '/inventario/dashboard'
        } else if (data.user.rol === 'admin') {
          window.location.href = '/inventario/movimientos'
        } else {
          window.location.href = '/inventario/entrada'
        }
      } else {
        setError(data.detail || 'Error de autenticación')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Inventario FIMLM
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Ingresar'}
          </Button>
        </form>

        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 3, display: 'block' }}>
          Credenciales de prueba:<br />
          Super Admin: superadmin / admin123<br />
          Admin: admin / admin123<br />
          Operativo: operativo / operativo123
        </Typography>
      </Paper>
    </Container>
  )
}

// Desactivar guards para la página de login
LoginPage.authGuard = false
LoginPage.guestGuard = true

export default LoginPage