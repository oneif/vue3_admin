// 创建用户相关的小仓库
import { defineStore } from "pinia"
import { ref } from "vue"
// 导入接口
import { login, getInfo, logout } from "@/api/users"
import type { loginForm } from "@/api/users/type"
import type { RouteRecordRaw } from "vue-router"
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token"
import { constantRoutes } from "@/router/routers"

let useUserStore = defineStore("User", () => {
    let token = ref<string | null>("")
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
    let username = ref("")
    let avatar = ref("")
    // 获取用户信息的方法
    const getUserInfo = async () => {
        await getInfo().then((resp) => {
            if (resp.code == 200) {
                username.value = resp.data.name
                avatar.value = resp.data.avatar
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

    // 仓库存储生成菜单需要的路由
    let menuRoutes: RouteRecordRaw[] = constantRoutes
    return {
        token,
        userLogin,
        menuRoutes,
        getUserInfo,
        username,
        avatar,
        userLogout,
    }
})

export default useUserStore
