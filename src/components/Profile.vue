<template>
  <v-container fluid>
      <!-- Showing loading progress -->
      <div v-if="!user.username">
        <v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
        <h3 class="title"> Loading account info. Please wait</h3>
        <v-progress-linear v-bind:indeterminate="true" color="primary"></v-progress-linear>
      </div>

      <!-- render content only when the user has been found-->
      <v-card v-else class="grey lighten-5" flat>
        <v-toolbar dark class="primary elevation-1" extended>
          <v-spacer></v-spacer>
          <v-btn flat icon to="/"><v-icon dark>help</v-icon></v-btn>
        </v-toolbar>
        <v-layout row>
          <v-flex xs10 offset-xs1>
            <v-card class="card--flex-toolbar">
              <v-toolbar card class="white" prominent>
                <v-toolbar-title class="title primary--text"><v-icon class="primary--text">perm_identity</v-icon> {{ user.f_name }} {{ user.s_name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn dark class="primary white--text">
                  <v-icon>lock</v-icon>
                 Change My Password
                </v-btn>
                <v-btn  v-if="authenticated" class="secondary white--text" @click.native="signOut">
                  <v-icon left dark>lock_outline</v-icon>
                  Sign out
                </v-btn>
                </v-toolbar>
              <v-divider></v-divider>
              <v-card-text>
                <v-data-table
                  v-bind:headers="headers"
                  :items="userDetail"
                  hide-actions
                  class="elevation-1"
                >
                <template slot="items" scope="props">
                  <td class="text-xs-left">{{ props.item.type }}</td>
                  <td class="text-xs-left">{{ props.item.gender }}</td>
                  <td class="text-xs-left">
                    <v-chip v-if="props.item.blocked === true" text-color="red" color="red" outline label>Blocked</v-chip>
                    <v-chip v-if="props.item.blocked === false" text-color="green" color="green" outline label>Not Blocked</v-chip>
                  </td>
                  <td class="text-xs-left">{{ props.item.created_at | niceDate }}</td>
                 </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs10 offset-xs1 class="mt-2">

            <v-card v-if = "user.type !== 'administrator'" class="side-color">
              <v-card-title><h3 class="title primary--text"><v-icon class="primary--text">timelapse</v-icon> Your account activities for the past week</h3></v-card-title>
              <v-card-text>
                <line-chart :height="110" :data="user.history" daysBack="7" :userType="user.type"></line-chart>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
  </v-container>
</template>

<script>

import LineChart from '@/components/LineChart.js'

export default {
  components: { LineChart },
  computed: {
    authUser () { return this.$store.getters.authUser },
    authenticated () {
      const authUser = this.$store.getters.authUser || null
      if (authUser && authUser.token) return true
      return false
    },
    userDetail () { return [this.user] } // for the table
  },
  mounted () {
    this.loadProfile()
  },
  methods: {
    loadProfile () {
      this.$http.get(`/users/${this.$route.params.username}/history`)
        .then(res => {
          this.user = res.data.user
        })
        // do nothing on failure
        .catch(console.log)
    },
    signOut () {
      this.$store.commit('setAuthUser', null)
      this.$router.push({ name: 'SignIn' })
    }
  },
  data () {
    return {
      headers: [
        { text: 'Account Type', value: 'type', align: 'left' },
        { text: 'Gender', value: 'gender', align: 'left' },
        { text: 'Blocked Status', value: 'blocked', align: 'left' },
        { text: 'Member since', align: 'left' }
      ],
      user: {} // for the graph
    }
  },

  filters: {
    niceDate (value) {
      return require('moment')().to(value)
    }
  }
}
</script>

<style scoped>
  .side-color {
   border-left-style: solid;
   border-left-color: purple;
   border-left-width: 2px;
 }
 .card--flex-toolbar {
    margin-top: -84px;
  }
</style>
