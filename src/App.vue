<template>
  <v-app light>
    <v-toolbar dark class="teal darken-2">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Computer Lock</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :to="{ path: '/help' }">
        <v-icon>help</v-icon>
      </v-btn>
    </v-toolbar>
  <router-view></router-view>
  </v-app>
</template>

<script>
  export default { }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
