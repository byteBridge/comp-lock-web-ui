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
        requiresAuth: true,
        requiresAdminAuth: true
      },
      children: [
        {
          // for now lets treat the he
          path: '/',
          component: require('@/components/AdminOverview'),
          meta: {
            requiresAuth: true,
            requiresAdminAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'new-account',
          component: require('@/components/CreateAccount'),
          meta: {
            requiresAuth: true,
            requiresAdminAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'users',
          component: require('@/components/ViewAccounts'),
          meta: {
            requiresAuth: true,
            requiresAdminAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'users/online',
          component: require('@/components/AdminOnlineAccounts'),
          meta: {
            requiresAuth: true,
            requiresAdminAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'users/:username',
          component: require('@/components/AdminViewAccount'),
          meta: {
            requiresAuth: true,
            requiresAdminAuth: true
          }
        },
        {
          // for now lets treat the he
          path: 'settings',
          component: require('@/components/AdminSettings'),
          meta: {
            requiresAuth: true,
            requiresAdminAuth: true
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

    // if student, allow only to view own account
    // allow the user
    if (authenticated) {
        // student attempted to open admin routes
      if (to.meta.requiresAdminAuth && user.user.type !== 'administrator') {
        return next({
          name: 'SignIn',
          query: {
            return_to: to.path,
            requires_admin: true
          }
        })
      }

      // Allow non admin only to view their accounts
      if (to.params.username && to.params.username === user.user.username || user.user.type === 'administrator') {
        return next()
      }

      // user is trying to view another student's account
      store.commit('showAlert', {
        title: `You are attempting to open another user's account. You can only open your account`,
        type: 'warning',
        show: true
      })

      return next({
        path: `/users/${user.user.username}`
      })
    }

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
