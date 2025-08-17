// ficheiro: vite.config.ts

import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'; // 1. Importe o plugin
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [ // 2. Adicione a seção de plugins
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icon.svg'], // Garante que o ícone seja cacheado
          manifest: {
            name: 'Gaku APP',
            short_name: 'Gaku',
            description: 'Um aplicativo de flashcards, estilo Anki, para ajudar a estudar japonês.',
            theme_color: '#008069',
            background_color: '#f0f2f5',
            display: 'standalone',
            start_url: '.',
            icons: [
              {
                src: 'icon.svg',
                sizes: 'any',
                type: 'image/svg+xml'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});