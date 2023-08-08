// 封装本地存token和取token的方法
export const SET_TOKEN = (token: string) => {
    localStorage.setItem("TOKEN", token)
}
export const GET_TOKEN = () => {
    return localStorage.getItem("TOKEN")
}
