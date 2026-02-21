import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tus ajustes generales
  trailingSlash: true,
  reactStrictMode: false,

  // Transpilar paquetes externos si lo necesitas
  // transpilePackages: ["paquete-a-transpilar"],

  // Turbopack specific config según la documentación
  turbopack: {
    root: '.', // 👈 fuerza la raíz correcta del proyecto
    resolveAlias: {
      '@components': path.resolve('./src/components')
      // puedes añadir más alias aquí
    }
    // Puedes usar resolveExtensions si lo necesites
    // resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  // Otros ajustes de Next.js que sí están soportados
  // Por ejemplo:
  images: {
    // tus patrones de remoteImages, etc.
  }
  // …otros ajustes válidos…
}

export default nextConfig
