<template>
  <v-app light id="app">

    <app-alert :alert="alert" :showAlert="showAlert"></app-alert>
    <!-- the admin navigation drawer -->
    <app-admin-navigation-drawer v-if="authUser && authUser.user.type==='administrator'"></app-admin-navigation-drawer>

    <v-toolbar light app clipped-left fixed>
      <v-toolbar-title
        class="teal--text">
        <v-btn flat :to="{ name: 'Home' }">
          <v-icon left light class="teal--text">desktop_mac</v-icon>
          CompManager
          </v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>
     
      <v-btn
        class="mr-0 ml-0"
        flat
        v-for="menu in toolbarMenuItems"
        :key="menu.id"
        :to="menu.url">
        <v-icon left light>{{menu.icon}}</v-icon>
        {{menu.title}}
      </v-btn>

      <!-- action buttons (not requiring one to navigate to another route)-->
      <v-btn
        v-if="authenticated"
        dark
        class="mr-3 ml-0 orange white--text"
        @click.native="signOut">
        <v-icon left dark>lock_outline</v-icon>
        Sign out
      </v-btn>

    </v-toolbar>

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
        return !!token
      },

      authUser () {
        return this.$store.getters.authUser || null
      },

      toolbarMenuItems () {
        const authenticatedMenus = [
          {
            id: 'help',
            title: 'Help',
            url: '/help',
            icon: 'help_outline'
          },
          {
            id: 'profile',
            title: this.authUser ? this.authUser.user.username : '',
            url: '/profile',
            icon: 'perm_identity'
          }
        ]

        const unAuthenticatedMenus = [
          {
            id: 'signin',
            title: 'Sign in',
            url: '/signin',
            icon: 'lock_open'
          },
          {
            id: 'help',
            title: 'Help',
            url: '/help',
            icon: 'help_outline'
          }
        ]

        return this.authenticated
          ? authenticatedMenus
          : unAuthenticatedMenus
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
