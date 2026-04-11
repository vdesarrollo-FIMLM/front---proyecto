import axios from 'axios'

// La URL debe coincidir con tu backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

console.log('🔵 API URL configurada:', API_URL)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para ver todas las peticiones
api.interceptors.request.use(request => {
  console.log('📤 Request:', request.method.toUpperCase(), request.url)
  return request
})

api.interceptors.response.use(
  response => {
    console.log('📥 Response:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('❌ Error en petición:', error.config?.url, error.message)
    return Promise.reject(error)
  }
)

export default api