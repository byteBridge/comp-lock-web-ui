import Vue from 'vue'
import Router from 'vue-router'
import Profile from '@/components/Profile'
import SignIn from '@/components/SignIn'
import Help from '@/components/Help'

import store from '@/store'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      // for now lets treat the he
      path: '/profile',
      name: 'Profile',
      component: Profile,
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
    },

    {
      path: '*',
      redirect: '/profile'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = store.getters.authUser
    const authenticated = (!!user === true && !!user.token === true)

    // allow the user
    if (authenticated) return next()

    // redirect to the login page.
    next({
      name: 'SignIn',
      query: {
        return_to: to.name
      }
    })
  } else {
    next()
  }
})
export default router
