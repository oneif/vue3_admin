// 常量路由
export const constantRoutes = [
    {
        // 登录页面
        path: "/login",
        component: () => import("@/views/login/index.vue"),
        name: "login", // 命名路由
    },
    {
        // 登录成功后展示数据
        path: "/",
        component: () => import("@/views/home/index.vue"),
    },
    {
        // 404
        path: "/404",
        component: () => import("@/views/404/index.vue"),
    },
    {
        // 任意
        path: "/:pathMatch(.*)*",
        redirect: "/404",
        name: "Any",
    },
]
