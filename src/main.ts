import { createApp } from "vue"
import App from "@/App.vue"
// element plus
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
// 暗黑模式
import "element-plus/theme-chalk/dark/css-vars.css"
// svg插件
import "virtual:svg-icons-register"
// 注册全局组件
import globalComponent from "@/components/index.ts"
// 引入全局样式
import "@/styles/index.scss"
// 路由
import router from "@/router/index.ts"
// 路由守卫
import "@/router/permission"
// 仓库
import store from "@/store/index.ts"
// 自定义指令
import { isHasButton } from "@/directive/hasButton.ts"

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
})
app.use(globalComponent)
app.use(router)
app.use(store)
isHasButton(app)

app.mount("#app")
