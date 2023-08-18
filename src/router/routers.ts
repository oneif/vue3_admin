// 常量路由(任何人都可以访问)
export const constantRoutes = [
    {
        // 登录页面
        path: "/login",
        component: () => import("@/views/login/index.vue"),
        name: "login", // 命名路由
        meta: {
            title: "登录",
            show: false, // 控制是否要显示 false不显示
            icon: "home", //小图标
        },
    },
    {
        // 登录成功后展示数据
        path: "/",
        component: () => import("@/layout/index.vue"),
        name: "layout",
        redirect: "/home",
        meta: {
            title: "",
            show: true,
            icon: "",
        },
        children: [
            {
                // 首页
                path: "/home",
                component: () => import("@/views/home/index.vue"),
                meta: {
                    title: "首页",
                    show: true,
                    icon: "home",
                },
            },
        ],
    },
    {
        path: "/screen",
        component: () => import("@/views/screen/index.vue"),
        name: "Screen",
        meta: {
            title: "数据大屏",
            show: true,
            icon: "screen",
        },
    },
    {
        // 404
        path: "/404",
        component: () => import("@/views/404/index.vue"),
        meta: {
            title: "404",
            show: false,
        },
    },
]

// 异步路由
export const asyncRoutes = [
    {
        path: "/acl",
        component: () => import("@/layout/index.vue"),
        name: "Acl",
        redirect: "/acl/user",
        meta: {
            title: "权限管理",
            show: true,
            icon: "lock",
        },
        children: [
            {
                path: "/acl/user",
                component: () => import("@/views/acl/user/index.vue"),
                name: "User",
                meta: {
                    title: "用户管理",
                    show: true,
                    icon: "user",
                },
            },
            {
                path: "/acl/role",
                component: () => import("@/views/acl/role/index.vue"),
                name: "Role",
                meta: {
                    title: "角色管理",
                    show: true,
                    icon: "role",
                },
            },
            {
                path: "/acl/permission",
                component: () => import("@/views/acl/permission/index.vue"),
                name: "Permission",
                meta: {
                    title: "菜单管理",
                    show: true,
                    icon: "permission",
                },
            },
        ],
    },
    {
        path: "/product",
        component: () => import("@/layout/index.vue"),
        name: "Product",
        redirect: "/product/trademark",
        meta: {
            title: "商品管理",
            show: true,
            icon: "product",
        },
        children: [
            {
                path: "/product/trademark",
                component: () => import("@/views/product/trademark/index.vue"),
                name: "Trademark",
                meta: {
                    title: "品牌管理",
                    show: true,
                    icon: "trademark",
                },
            },
            {
                path: "/product/attr",
                component: () => import("@/views/product/attr/index.vue"),
                name: "Attr",
                meta: {
                    title: "属性管理",
                    show: true,
                    icon: "attr",
                },
            },
            {
                path: "/product/spu",
                component: () => import("@/views/product/spu/index.vue"),
                name: "Spu",
                meta: {
                    title: "SPU管理",
                    show: true,
                    icon: "spu",
                },
            },
            {
                path: "/product/sku",
                component: () => import("@/views/product/sku/index.vue"),
                name: "Sku",
                meta: {
                    title: "SKU管理",
                    show: true,
                    icon: "sku",
                },
            },
        ],
    },
]

// 任意路由
export const anyRoutes = [
    {
        // 任意
        path: "/:pathMatch(.*)*",
        redirect: "/404",
        name: "Any",
        meta: {
            title: "any",
            show: false,
        },
    },
]
