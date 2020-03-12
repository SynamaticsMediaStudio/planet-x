const routes = [{
        path: '/',
        name: 'Home',
        component: () => import('../views/Index.vue')
    },
    {
        path: '*',
        redirect: '/'
    }
]
export default routes;