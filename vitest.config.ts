import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'happy-dom',
        include: ['**/*.spec.ts', '**/*.test.ts'],
        exclude: ['node_modules', 'e2e']
    },
    resolve: {
        alias: {
            '~': resolve(__dirname, './app')
        }
    }
})
