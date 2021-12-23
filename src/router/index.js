import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: "首页"
        },
        component: Home,
        redirect: '/welcome',//少了welcome，导致Uncaught RangeError: Maximum call stack size exceeded
        children: [
            {
                name: "welcome",
                path: "/welcome",
                meta: {
                    title: "欢迎页"
                },
                component: () => import('../views/Welcome.vue')
            },
            {
                name: "用户管理",
                path: "/system/user",
                meta: {
                    title: "用户管理"
                },
                component: () => import('../views/User.vue'),

            },
            {
                name: "菜单管理",
                path: "/system/menu",
                meta: {
                    title: "菜单管理"
                },
                component: () => import('../views/Menu.vue'),

            },
            {
                name: "角色管理",
                path: "/system/role",
                meta: {
                    title: "角色管理"
                },
                component: () => import('../views/Role.vue'),

            }
        ]
    },
    {
        name: "login",
        path: "/login",
        meta: {
            title: "登录页"
        },
        component: () => import('../views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router