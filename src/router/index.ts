import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { defineAsyncComponent } from 'vue'

const lazyLoad = (file: any) => import(/* webpackChunkName: "[request]" */ `@/views/${file}.vue`)

const MainLayout = defineAsyncComponent(() => import('@/layouts/main-layout.vue'))

import UserRoutes from './user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: {
        layout: MainLayout,
      },
      children: [
        {
          path: '',
          component: HomeView,
        },
        ...UserRoutes,
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
  ],
})

export default router
