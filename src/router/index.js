import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Manager',
      component: () => import('@/views/Manager.vue'),
      redirect: '/home',
      children: [
        { path: 'home', name: 'Home', component: () => import('@/views/manager/Home.vue')},
        { path: 'course', name: 'Course', component: () => import('@/views/manager/Course.vue')},
        { path: 'blog', name: 'blog', component: () => import('@/views/manager/Blog.vue')},
        { path: '/Article/:id', name: 'Article', component: () => import('@/views/manager/Article.vue') },

      ]
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    }
  ]
})

export default router
