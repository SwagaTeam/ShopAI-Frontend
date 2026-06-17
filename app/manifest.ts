import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ShopAI',
    short_name: 'ShopAI',
    description: 'Интеллектуальный магазин ShopAI',
    start_url: '/auth',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1A56DB',
    icons: [
      {
        src: '/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
