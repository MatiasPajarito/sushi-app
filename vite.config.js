import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo-oishii.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Oishii Sushi - Pedidos Online',
        short_name: 'Oishii Sushi',
        description: 'La mejor experiencia Nikkei en Melipilla',
        theme_color: '#001a3d', // El azul marino oficial de tu app
        background_color: '#000d1a', // Fondo oscuro para la splash screen
        display: 'standalone', // Hace que se abra como una App sin barras de navegador
        scope: '/sushi-app/',
        start_url: '/sushi-app/',
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
            purpose: 'any maskable' // Clave para que el icono se vea bien en Android
          }
        ]
      }
    })
  ],
  base: '/sushi-app/', // Necesario para GitHub Pages
})