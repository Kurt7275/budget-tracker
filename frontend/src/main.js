import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/base.css'

// Lazy-loaded route views
const LoginView    = () => import('./views/LoginView.vue')
const RegisterView = () => import('./views/RegisterView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',         redirect: '/login' },
    { path: '/login',    name: 'Login',    component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
