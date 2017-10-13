import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // for now lets treat the he
      path: '/users',
      name: 'Profile',
      component: require('@/components/Profile'),
      meta: {
        requiresAuth: true
      }
    },

    {
      // for now lets treat the he
      path: '/users/:username',
      name: 'User',
      component: require('@/components/Profile'),
      meta: {
        requiresAuth: true
      }
    },

    {
      // for now lets treat the he
      path: '/',
      name: 'Home',
      component: require('@/components/Home')
    },

    {
      // for now lets treat the he
      path: '/admin',
      name: 'Admin',
      component: require('@/components/Admin'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          // for now lets treat the he
          path: '/',
          component: require('@/components/AdminOverview'),
          meta: {
            requiresAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'new-account',
          component: require('@/components/CreateAccount'),
          meta: {
            requiresAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'users',
          component: require('@/components/ViewAccounts'),
          meta: {
            requiresAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'settings',
          component: require('@/components/AdminSettings'),
          meta: {
            requiresAuth: true
          }
        }
      ]
    },

    {
      path: '/signin',
      name: 'SignIn',
      component: require('@/components/SignIn')
    },

    {
      path: '/help',
      name: 'Help',
      component: require('@/components/Help')
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
