import { defineConfig } from '@unpackjs/cli'
import { pluginReact } from '@unpackjs/plugin-react'

export default defineConfig({
  build: {
    copy: [
      {
        from: 'manifest.json',
      },
      {
        from: 'src/assets/logo',
        to: 'logo',
      },
    ],
    sourcemap: false,
    filenameHash: false,
  },
  mpa: {
    layout: '@/layouts/mpa/index.tsx',
  },
  bundlerConfig: {
    entry: {
      background: './src/scripts/background.js',
      content: './src/scripts/content.js',
      inject: './src/scripts/inject.js',
    },
  },
  plugins: [pluginReact()],
})
