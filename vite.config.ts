import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
            symbolId: "icon-[dir]-[name]",
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
        },
    },
    // scss全局变量
    css: {
        preprocessorOptions: {
            scss: {
                javascriptEnabled: true,
                additionalData: '@import "./src/styles/variable.scss";',
            },
        },
    },
    server: {
        proxy: {
            // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
            "/api": {
                target: "http://sph-api.atguigu.cn",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
})
