// 创建用户相关的小仓库
import { defineStore } from "pinia"
// 导入接口
import { login } from "@/api/users"
import type { loginForm } from "@/api/users/type"
import { SET_TOKEN, GET_TOKEN } from "@/utils/token"

let useUserStore = defineStore("User", () => {
    let token: string | null = GET_TOKEN()
    const userLogin = async (data: loginForm) => {
        await login(data).then((resp) => {
            if (resp.code == 200) {
                token = resp.data
                SET_TOKEN(resp.data)
                return Promise.resolve(resp)
            } else {
                return Promise.reject(resp)
            }
        })
    }
    return {
        userLogin,
    }
})

export default useUserStore
