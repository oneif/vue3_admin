import pinia from "@/store"
import useUserStore from "@/store/modules/user"
const userStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
    // 使用 v-hasbutton=''
    app.directive("hasbutton", {
        //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
        // el:使用自定义指令的DOM节点 options:配置项可以拿到使用自定义指令时传入的值
        mounted(el: any, options: any) {
            if (!userStore.buttons.includes(options.value))
                el.parentNode.removeChild(el)
        },
    })
}
