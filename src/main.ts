import { createApp } from "vue"
import App from "@/App.vue"
// element plus
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
// svg插件
import "virtual:svg-icons-register"
// 注册全局组件
import globalComponent from "@/components/index.ts"
import "@/styles/index.scss"

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
})
app.use(globalComponent)
app.mount("#app")
