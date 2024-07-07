import { defineConfig } from '@unpackjs/cli'

export default defineConfig({
  bundler: 'rspack',
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
  clickToComponent: false,
})
