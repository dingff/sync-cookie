import { defineConfig } from '@unpackjs/core'
import { pluginCrx } from '@unpackjs/plugin-crx'
import { pluginReact } from '@unpackjs/plugin-react'

export default defineConfig({
  sourceMap: false,
  build: {
    filenameHash: false,
  },
  mpa: {
    layout: 'src/layouts/mpa/index.tsx',
  },
  rspack: {
    entry: {
      background: './src/scripts/background.js',
      content: './src/scripts/content.js',
      inject: './src/scripts/inject.js',
    },
  },
  plugins: [pluginReact(), pluginCrx()],
})
