import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Oishii Sushi - Pedidos Online',
        short_name: 'Oishii Sushi',
        description: 'La mejor experiencia Nikkei en Melipilla',
        theme_color: '#001a3d',
        background_color: '#000d1a',
        display: 'standalone',
        
        // CAMBIO AQUÍ: En Vercel usamos la raíz
        scope: '/', 
        start_url: '/', 
        
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // CAMBIO AQUÍ: Esto elimina el error 404 en Vercel
  base: '/', 
})