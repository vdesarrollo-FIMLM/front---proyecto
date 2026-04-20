import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuario", type: "text", placeholder: "usuario" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials, req) {
        // Aquí conectas con tu backend FastAPI
        try {
          const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password
            })
          })
          
          const user = await res.json()
          
          if (res.ok && user) {
            // Retorna el objeto usuario que se guardará en la sesión
            return {
              id: user.id,
              name: user.username,
              email: user.email,
              role: user.role
            }
          }
          return null
        } catch (error) {
          console.error('Error de autenticación:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/login',        // Página de login personalizada
    signUp: '/registro',     // Página de registro
    error: '/auth/error',    // Página de error
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }