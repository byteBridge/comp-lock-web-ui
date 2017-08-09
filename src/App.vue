<template>
  <v-app light>
    <v-toolbar dark class="teal darken-2">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Computer Lock</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :to="{ path: '/help' }">
        <v-icon>help</v-icon>
      </v-btn>
      <v-btn
        :to="signinUrl"
        v-if="authenticated === false && $route.path !=='/signin'"
      >
        SIGN IN
      </v-btn>
    </v-toolbar>
  <router-view></router-view>
  </v-app>
</template>

<script>
  export default {
    computed: {
      signinUrl () {
        return { path: '/signin' }
      },

      authenticated () {
        const user = JSON.parse(localStorage.getItem('user'))
        const token = user ? user.token : null
        return !!token
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
