export const getTime = () => {
    let message: string = ""
    let hours: number = new Date().getHours()
    if (hours <= 9) {
        message = "早上好☀"
    } else if (hours <= 12) {
        message = "上午好☕"
    } else if (hours <= 17) {
        message = "下午好🍮"
    } else {
        message = "晚上好🌙"
    }
    return message
}
