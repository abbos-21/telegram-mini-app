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
      component: TaskView,
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
    },
    {
      path: '/friends',
      name: 'friends',
      component: FriendsView,
    },
    {
      path: '/widthdraw',
      name: 'widthdraw',
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
