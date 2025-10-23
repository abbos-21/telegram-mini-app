import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskView from '../views/TaskView.vue'
import ShopView from '../views/ShopView.vue'
import FriendsView from '../views/FriendsView.vue'
import WidthdrawView from '../views/WidthdrawView.vue'
import WidthdrawHistoryView from '@/views/WidthdrawHistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/task',
      name: 'task',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/TaskView.vue'),
      component: TaskView,
    },
    {
      path: '/shop',
      name: 'shop',
      // component: () => import('../views/ShopView.vue'),
      component: ShopView,
    },
    {
      path: '/friends',
      name: 'friends',
      // component: () => import('../views/FriendsView.vue'),
      component: FriendsView,
    },
    {
      path: '/widthdraw',
      name: 'widthdraw',
      // component: () => import('../views/WidthdrawView.vue'),
      component: WidthdrawView,
    },
    {
      path: '/widthdraw-history',
      name: 'widthdraw-history',
      component: WidthdrawHistoryView,
    },
  ],
})

export default router
