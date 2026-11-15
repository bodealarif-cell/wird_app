import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
export default defineConfig({ plugins: [react(), viteSingleFile()], base: './', build: { outDir: 'dist-web', target: 'es2020', assetsInlineLimit: 100000000, chunkSizeWarningLimit: 9000, cssCodeSplit: false } })
