import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import storage from '../utils/storage'
import API from '../api'
import utils from '../utils/utils'

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
            // {
            //     name: "用户管理",
            //     path: "/system/user",
            //     meta: {
            //         title: "用户管理"
            //     },
            //     component: () => import('../views/User.vue'),

            // },
            // {
            //     name: "菜单管理",
            //     path: "/system/menu",
            //     meta: {
            //         title: "菜单管理"
            //     },
            //     component: () => import('../views/Menu.vue'),

            // },
            // {
            //     name: "角色管理",
            //     path: "/system/role",
            //     meta: {
            //         title: "角色管理"
            //     },
            //     component: () => import('../views/Role.vue'),

            // },
            // {
            //     name: "部门管理",
            //     path: "/system/dept",
            //     meta: {
            //         title: "部门管理"
            //     },
            //     component: () => import('../views/Dept.vue'),

            // }
        ]
    },
    {
        name: "login",
        path: "/login",
        meta: {
            title: "登录页"
        },
        component: () => import('../views/Login.vue')
    },
    {
        name: "404",
        path: "/404",
        meta: {
            title: "404页面"
        },
        component: () => import('../views/404.vue')
    },
    // {
    //     name: "test",
    //     path: "/test",
    //     meta: {
    //         title: "test页面"
    //     },
    //     component: () => import('../views/Test.vue')
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//动态生成路由
async function loadAsyncRouters() {
    let userInfo = storage.getItem('userInfo') || {};
    if (userInfo.token) {
        try {
            //通过接口获取用户权限列表
            const { menuList } = await API.getPermissionList();
            let routers = utils.getRouterInfo(menuList);
            routers.map(route => {
                //处理component的值
                let url = `../views/${route.name}.vue`;
                route.component = () => import(url);
                //添加至路由库
                router.addRoute('home', route);
            })
        } catch (error) {

        }
    }
}
loadAsyncRouters()


//路由的守卫
router.beforeEach((to, from, next) => {
    if (judgeRouter(to.path)) {
        document.title = to.meta.title;
        next();
    } else {
        document.title = "404页面";
        next('/404');
    }
})

//判断路由是否存在
function judgeRouter(path) {
    let routerListLength = router.getRoutes().filter(router => router.path == path).length;
    if (routerListLength) {
        return true;
    } else {
        return false;
    }
}

export default router