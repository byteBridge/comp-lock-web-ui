import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import SignIn from '@/components/SignIn'
import Help from '@/components/Help'

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
    },

    {
      path: '/help',
      name: 'Help',
      component: Help
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = JSON.parse(localStorage.getItem('user'))
    const authenticated = (!!user === true && !!user.token === true)

    // allow the user
    if (authenticated) return next()

    // redirect to the login page.
    next({
      name: 'SignIn',
      query: {
        return_to: to.fullPath
      }
    })
  } else {
    next()
  }
})
export default router
