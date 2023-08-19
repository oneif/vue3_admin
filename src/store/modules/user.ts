// 创建用户相关的小仓库
import { defineStore } from "pinia"
import { ref } from "vue"
// 导入接口
import { login, getInfo, logout } from "@/api/users"
import type { loginForm } from "@/api/users/type"
import router from "@/router"
import type { RouteRecordRaw } from "vue-router"
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token"
import { constantRoutes, asyncRoutes, anyRoutes } from "@/router/routers"
// 引入深拷贝
import cloneDeep from "lodash/cloneDeep"

// 用于过滤当前用户需要展示的异步路由 asyncRoutes所有的异步路由 userRoutes获取到的用户路由
const filterAsyncRoutes = (asyncRoutes: any, userRoutes: any) => {
    return asyncRoutes.filter((item: any) => {
        if (userRoutes.includes(item.name)) {
            if (item.children && item.children.length > 0)
                item.children = filterAsyncRoutes(item.children, userRoutes)
            return true
        }
    })
}

const useUserStore = defineStore("User", () => {
    const token = ref<string | null>("")
    token.value = GET_TOKEN()
    // 用户登录的方法
    const userLogin = async (data: loginForm) => {
        await login(data).then((resp) => {
            if (resp.code == 200) {
                token.value = resp.data
                SET_TOKEN(resp.data)
                return Promise.resolve(resp)
            } else return Promise.reject(resp)
        })
    }
    const username = ref("")
    const avatar = ref("")
    // 仓库存储生成菜单需要的路由
    const menuRoutes = ref<RouteRecordRaw[]>(constantRoutes)
    // 存储当前用户是否拥有某个按钮
    const buttons = ref<string[]>([])
    // let menuRoutes = constantRoutes
    // 获取用户信息的方法
    const getUserInfo = async () => {
        await getInfo().then((resp) => {
            if (resp.code == 200) {
                username.value = resp.data.name
                avatar.value = resp.data.avatar
                buttons.value = resp.data.buttons
                const userAsyncRoute = filterAsyncRoutes(
                    cloneDeep(asyncRoutes),
                    resp.data.routes,
                )
                menuRoutes.value = [
                    ...constantRoutes,
                    ...userAsyncRoute,
                    ...anyRoutes,
                ]
                console.log(menuRoutes)
                ;[...userAsyncRoute, ...anyRoutes].forEach((route: any) =>
                    router.addRoute(route),
                )
                return Promise.resolve(resp)
            } else return Promise.reject(new Error(resp.message))
        })
    }

    // 退出登录的方法
    const userLogout = async () => {
        await logout().then((resp) => {
            if (resp.code == 200) {
                REMOVE_TOKEN()
                token.value = null
                username.value = ""
                avatar.value = ""
                return Promise.resolve(resp.message)
            } else return Promise.reject(new Error(resp.message))
        })
    }

    return {
        token,
        userLogin,
        menuRoutes,
        getUserInfo,
        username,
        avatar,
        buttons,
        userLogout,
    }
})

export default useUserStore
