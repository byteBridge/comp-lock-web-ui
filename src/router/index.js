import Vue from 'vue'
import Router from 'vue-router'
import Profile from '@/components/Profile'
import Home from '@/components/Home'
import Admin from '@/components/Admin'
import SignIn from '@/components/SignIn'
import Help from '@/components/Help'

import store from '@/store'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      // for now lets treat the he
      path: '/users/:username',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },

    {
      // for now lets treat the he
      path: '/',
      name: 'Home',
      component: Home
    },

    {
      // for now lets treat the he
      path: '/admin',
      name: 'Admin',
      component: Admin,
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
      redirect: '/'
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
        return_to: to.path
      }
    })
  } else {
    next()
  }
})
export default router
