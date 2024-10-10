
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {updateCommonjsPlugin} from './Update'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [updateCommonjsPlugin(),react()],
    define: {
        global: {},
    },
    server: {
        // host: "10.147.23.65",
        port: 5000,
      },
    resolve: {
        alias: {
            './runtimeConfig': './runtimeConfig.browser',
        },
    },
})