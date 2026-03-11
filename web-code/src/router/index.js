import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/DashboardView.vue') },
      { path: 'admin', name: 'Admin', component: () => import('@/views/dashboard/AdminView.vue') },
      { path: 'user', name: 'User', component: () => import('@/views/dashboard/UserView.vue') },
      { path: 'category', name: 'Category', component: () => import('@/views/dashboard/CategoryView.vue') },
      { path: 'product', name: 'Product', component: () => import('@/views/dashboard/ProductView.vue') },
      { path: 'order', name: 'Order', component: () => import('@/views/dashboard/OrderView.vue') },
      { path: 'banner', name: 'Banner', component: () => import('@/views/dashboard/BannerView.vue') },
      { path: 'review', name: 'Review', component: () => import('@/views/dashboard/ReviewView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 导航守卫
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth !== false && !token) {
    return '/login'
  }
  if (to.path === '/login' && token) {
    return '/dashboard'
  }
})

export default router
