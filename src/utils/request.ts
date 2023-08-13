import axios from "axios"
import { ElMessage } from "element-plus"
// 引入用户相关的仓库
import useUserStore from "@/store/modules/user"
let request = axios.create({
    baseURL: "http://sph-api.atguigu.cn",
    timeout: 60000,
})
// 请求拦截器
request.interceptors.request.use((config) => {
    const token = useUserStore().token
    if (token) config.headers.token = token
    return config
})
// 响应拦截器
request.interceptors.response.use(
    (resp) => {
        return resp.data
    },
    (err) => {
        console.log(err)

        let msg: string = err.code
        // let status = err.response.status
        // switch (status) {
        //     case 401:
        //         msg = "token过期"
        //         break
        //     case 403:
        //         msg = "无权访问"
        //         break
        //     case 404:
        //         msg = "请求地址错误"
        //         break
        //     case 500:
        //         msg = "服务器出现问题"
        //         break
        //     default:
        //         msg = "无网络"
        // }
        ElMessage({
            type: "error",
            message: msg,
        })
        return Promise.reject(err)
    },
)

export default request
