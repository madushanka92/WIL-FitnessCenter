import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { defineAsyncComponent } from 'vue'

const lazyLoad = (file: any) => import(/* webpackChunkName: "[request]" */ `@/views/${file}.vue`)

const MainLayout = defineAsyncComponent(() => import('@/layouts/main-layout.vue'))
const AdminLayout = defineAsyncComponent(() => import('@/layouts/admin-layout.vue'))

import UserRoutes from './user'
import AdminRoutes from './admin'
import { isCurrentUserAdmin } from '@/_services/helpers/helpers'
import { useUserAuthStore } from '@/stores/auth.module'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          component: HomeView,
        },
        {
          path: 'home',
          component: HomeView,
        },
        ...UserRoutes,
        ...AdminRoutes,
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/',
      meta: {
        requiresAuth: false,
        layout: MainLayout,
      },
      children: [
        {
          path: '/unauthorized',
          name: 'unauthorized',
          component: () => import('../views/unauthorized.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useUserAuthStore() // Ensure store is reactive
  const isAdmin = isCurrentUserAdmin() // Dynamically check role

  if (to.meta.requiresAuth) {
    to.meta.layout = isAdmin ? AdminLayout : MainLayout
  }

  if (to.meta.isAdmin && !isAdmin) {
    next({ name: 'unauthorized' })
  } else next()
})

export default router
