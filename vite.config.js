import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import importToCDN from 'vite-plugin-cdn-import';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        importToCDN({
            modules: [
                {
                    name: 'vue',
                    var: 'Vue',
                    // path: 'https://cdn.bootcdn.net/ajax/libs/vue/3.4.31/vue.runtime.global.prod.min.js',
                    path: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.global.prod.min.js',
                },
            ],
        }),
    ],
    esbuild: {
        drop: ['debugger'],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
