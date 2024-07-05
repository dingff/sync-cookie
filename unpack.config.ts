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
  webpackAndRspack: {
    entry: {
      background: './src/scripts/background.js',
      content: './src/scripts/content.js',
      beforeLoad: './src/scripts/beforeLoad.js',
      afterLoad: './src/scripts/afterLoad.js',
    },
  },
  clickToComponent: false,
})
