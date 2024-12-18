import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sourceCodeDelivery } from './plugins/source-code-delivery'
import path from 'path'

export default defineConfig({
    plugins: [react(), sourceCodeDelivery()],
    resolve: {
        alias: {
            '@packages': path.resolve(__dirname, 'packages')
        }
    }
}) 