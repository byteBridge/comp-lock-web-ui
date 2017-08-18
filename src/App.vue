<template>
  <v-app light>
    <v-toolbar dark class="teal darken-2">

      <v-toolbar-title class="white--text"><v-icon dark>desktop_mac</v-icon> CompManager</v-toolbar-title>
      <v-spacer></v-spacer>
     
      <v-btn
        class="mr-0 ml-0"
        flat
        v-for="menu in toolbarMenuItems"
        :key="menu.id"
        :to="menu.url">
        <v-icon left dark>{{menu.icon}}</v-icon>
        {{menu.title}}
      </v-btn>

      <!-- action buttons (not requiring one to navigate to another route)-->
      <v-btn
        circular
        v-if="authenticated"
        class="mr-3 ml-0 orange"
        @click.native="signOut">
        <v-icon left dark >lock_outline</v-icon>
        Sign out
      </v-btn>

    </v-toolbar>
    <main>
      <v-container>
        <v-flex xs12>
          <router-view></router-view>
        </v-flex>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  export default {
    methods: {
      signOut () {
        this.$store.commit('setAuthUser', null)
        this.$router.push({ name: 'SignIn' })
      }
    },

    computed: {
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
