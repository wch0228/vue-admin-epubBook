import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]
/*  hidden: true, 隐藏侧边栏 */
/* activeMenu高亮显示所在路由 */
/* affix属性为固定在tagview */
export const asyncRoutes = [
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/book',
    name: 'book',
    component: Layout,
    redirect: '/book/create',
    meta: { title: '图书管理', icon: 'documentation' },
    children: [
      {
        name: 'bookCreate',
        path: '/book/create',
        component: () => import('@/views/book/create'),
        meta: { title: '上传图书', icon: 'edit' }
      },
      {
        name: 'bookList',
        path: '/book/list',
        component: () => import('@/views/book/list'),
        meta: { title: '图书列表', icon: 'list' }
      },
      {
        name: 'bookEdit',
        path: '/book/edit/:fileName',
        component: () => import('@/views/book/edit'),
        hidden: true,
        meta: { title: '编辑图书', icon: 'edit', activeMenu: '/book/list' }
      }
    ]
  }

]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
