import axios from "axios"
import { ElMessage } from "element-plus"

let request = axios.create({
    baseURL: "http://sph-api.atguigu.cn",
    timeout: 5000,
})

request.interceptors.request.use((config) => {
    return config
})

request.interceptors.response.use(
    (resp) => {
        return resp.data
    },
    (err) => {
        let msg: string = ""
        let status = err.response.status
        switch (status) {
            case 401:
                msg = "token过期"
                break
            case 403:
                msg = "无权访问"
                break
            case 404:
                msg = "请求地址错误"
                break
            case 500:
                msg = "服务器出现问题"
                break
            default:
                msg = "无网络"
        }
        ElMessage({
            type: "error",
            message: msg,
        })
        return Promise.reject(err)
    },
)

export default request
