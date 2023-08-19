// 路由鉴权
import router from "@/router"
import nprogress from "nprogress"
import "nprogress/nprogress.css"
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router"
import Pinia from "../store"
import useUserStore from "@/store/modules/user"

const userStore = useUserStore(Pinia)

// 全局前置守卫
router.beforeEach(
    async (
        to: RouteLocationNormalized,
        _from: RouteLocationNormalized,
        next: NavigationGuardNext,
    ) => {
        nprogress.start()
        if (userStore.token) {
            // 有token
            if (to.path == "/login") {
                next("/home")
            } else {
                if (userStore.username) {
                    // 如果有用户信息 放行
                    next()
                } else {
                    // 没有用户信息 发请求拿到用户信息再放行
                    try {
                        await userStore.getUserInfo()
                        // 如果在异步路由的界面刷新，这时候会出现异步路由还没加载完就放行
                        // 所以在next中卡住，只到加载完再放行
                        next({ ...to, replace: true })
                    } catch (error) {
                        // token过期:获取不到用户信息了
                        // 用户修改了本地存储的token
                        // do->退出登录 清空用户相关的数据
                        await userStore.userLogout()
                        next("/login")
                    }
                }
            }
        } else {
            // 没有token
            if (to.path == "/login") {
                next()
            } else {
                next("/login")
            }
        }
    },
)
// 全局后置守卫
router.afterEach(
    (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
        nprogress.done()
        document.title = "灵犀后台管理系统-" + to.meta.title
    },
)
