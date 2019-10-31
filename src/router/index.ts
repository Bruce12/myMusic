import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
// import Layout from '@/layout/index.vue'
Vue.use(Router)
export const constantRoutes: RouteConfig[] = [
  {
    path: '/css_animation',
    component: () => import(/* webpackChunkName: "csscss_animation" */'@/views/css-animation/animation.vue')
  }
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

export default router
