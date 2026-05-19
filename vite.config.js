import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'logo-icon.png', 'favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Islamediaku',
        short_name: 'Islamediaku',
        description: 'Islamediaku adalah aplikasi Islami harian untuk jadwal sholat, Mushaf Al-Qur’an, arah kiblat, kalender Hijriah, doa dan dzikir, tasbih, tilawah Qur’an, khutbah, dan tracker ibadah.',
        theme_color: '#0047FF',
        background_color: '#F5F8FF',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Precache HTML to prevent unstyled loading issues
        globPatterns: ['**/*.{html,js,css,ico,png,svg,woff,woff2}'],
        
        // SW takes control immediately without waiting for all tabs to close
        skipWaiting: true,
        clientsClaim: true,

        // SPA fallback for offline
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^\/api\//,            // Vercel serverless functions
          /^\/version\.json/,    // Version check must always be fresh
          /\.xml$/,              // sitemap
          /\.txt$/,              // robots.txt
        ],

        runtimeCaching: [
          // Quran API — cache for offline reading
          {
            urlPattern: /^https:\/\/api\.quran\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Weather API — network first, short cache
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 2 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Prayer times API — network first
          {
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'prayer-api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 6 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // MP3Quran radio API — network first
          {
            urlPattern: /^https:\/\/mp3quran\.net\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mp3quran-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Google Fonts CSS
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
            }
          },
          // Google Fonts files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
})
