import { createMemoryHistory, createRouter } from 'vue-router'

import Home from '../pages/Home.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/settings', component: Settings},
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;  