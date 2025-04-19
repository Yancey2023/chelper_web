import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import importToCDN from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        importToCDN({
            modules: [
                {
                    name: 'vue',
                    var: 'Vue',
                    path: 'https://cdn.bootcdn.net/ajax/libs/vue/3.5.13/vue.runtime.global.prod.min.js',
                    // path: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.global.prod.min.js',
                },
            ],
        }),
    ],
    build: {
        minify: "esbuild",
    },
    esbuild: {
        drop: ['debugger'],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    base: '/chelper_web/'
})
