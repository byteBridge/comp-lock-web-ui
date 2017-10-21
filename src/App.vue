<template>
  <v-app light id="app">

    <app-alert :alert="alert" :showAlert="showAlert"></app-alert>
    <!-- the admin navigation drawer -->
    <app-admin-navigation-drawer v-if="authenticated && authUser.user.type==='administrator'"></app-admin-navigation-drawer>

   <!-- The Main content -->
    <main>
      <v-content>
        <v-container id="wrapping" fluid>
            <router-view></router-view>
        </v-container>
      </v-content>
    </main>

  </v-app>
</template>

<script>
  import AppAdminNavigationDrawer from '@/components/AppAdminNavigationDrawer'
  import AppAlert from '@/components/AppAlert'
  
  export default {
    data () {
      return {
        showAlert: false
      }
    },
    methods: {
      signOut () {
        this.$store.commit('setAuthUser', null)
        this.$router.push({ name: 'SignIn' })
      }
    },
    components: { AppAlert, AppAdminNavigationDrawer },
    computed: {
      alert () {
        this.showAlert = this.$store.getters.alert.show
        return this.$store.getters.alert
      },
      authenticated () {
        const token = this.authUser ? this.authUser.token : null
        // this trick is to set the Authorisation headers once the
        // token of the authUser changes. It will make all post and
        // put requests have the Authorization header without fear of
        // preflight issues.
        this.$http.defaults.headers.common['Authorization'] = token
        return !!token
      },

      authUser () {
        return this.$store.getters.authUser || null
      },

      toolbarMenuItems () {
        const menu = [
          {
            id: 'signin',
            title: 'Sign in',
            url: '/signin',
            icon: 'lock_open'
          }
        ]

        return menu
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
