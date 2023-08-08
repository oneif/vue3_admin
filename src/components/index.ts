// 用于注册全局组件
import type { App, Component } from "vue"

import SvgIcon from "@/components/SvgIcon/index.vue"
const globalComponents: { [name: string]: Component } = { SvgIcon }
export default {
    // 只能叫做install方法，因为vue3中插件必须要有install方法
    install(app: App) {
        Object.keys(globalComponents).forEach((key) => {
            // 注册组件
            app.component(key, globalComponents[key])
        })
    },
}
