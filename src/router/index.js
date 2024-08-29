// 封装路由router，统一管理路径
import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        component: ()=>import("@/View.vue"),
        children:[
            {
                path:"/",
                component:()=> import("@/views/Command.vue")
            }
        ]
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
