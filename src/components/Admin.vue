<template>
  <div>
      <p>Hello admin. Only authenticated people can see this</p>
      <v-card>
          <v-card-text>
              <v-list>
                  <v-list-tile v-for = "user in users" :key="user.username">
                      <p>{{ user.f_name }} {{ user.s_name }}</p> <v-chip small>{{user.type}}</v-chip>
                  </v-list-tile>
              </v-list>
          </v-card-text>
      </v-card>
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
