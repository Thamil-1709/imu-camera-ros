import { createMemoryHistory, createRouter } from 'vue-router'

import Home from '../pages/Home.vue'
import Settings from '../pages/Settings.vue'
import CameraPage from '../views/CameraPage.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/settings', component: Settings},
  { path: '/camera', name: 'Camera', component: CameraPage },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;  