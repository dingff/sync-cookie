import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'

export default defineConfig({
  source: {
    entry: {
      popup: './src/pages/popup/index.tsx',
      background: {
        import: './src/scripts/background.js',
        html: false,
      },
      content: {
        import: './src/scripts/content.js',
        html: false,
      },
      inject: {
        import: './src/scripts/inject.js',
        html: false,
      },
    },
  },
  output: {
    filenameHash: false,
    copy: [
      {
        from: 'manifest.json',
      },
      {
        from: 'src/assets/logo',
        to: 'logo',
      },
    ],
    sourceMap: false,
    distPath: {
      js: 'js',
      css: 'css',
    },
  },
  plugins: [pluginSass(), pluginReact()],
})
