import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import SignIn from '@/components/SignIn'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // for now lets treat the he
      path: '/',
      name: 'Hello',
      component: Hello
    },

    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    }
  ]
})

export default router
