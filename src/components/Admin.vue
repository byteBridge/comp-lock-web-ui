<template>
  <div>
    <v-container>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
import axios from '@/modules/axios'
export default {
  data () {
    return {
      users: []
    }
  },
  mounted () {
    axios.get(`/secret?token=${this.$store.getters.authUser.token}`)
      .then(res => {
        this.users = res.data.users
      })
      .catch(alert)
  }
}
</script>

<style>

</style>
