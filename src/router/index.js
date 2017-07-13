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
      component: Hello,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = JSON.parse(localStorage.getItem('user'))
    next((!user || !user.token)
      ? true
      : {
        name: 'SignIn',
        query: {
          return_to: to.fullPath
        }
      }
    )
  } else {
    next()
  }
})
export default router
