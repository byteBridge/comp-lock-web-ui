<template>
  <div>
    
  <v-toolbar dense class="transparent mb-2" flat>
    <v-toolbar-title><h3 class="title gray--text">Online Accounts</h3></v-toolbar-title>
    <v-spacer></v-spacer>
        <v-text-field
        class="mr-0"
        solo
        light
        style="border-radius:2px;"
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="searchText"
      ></v-text-field>
    </v-toolbar>
    <v-card>
     <v-card-text>
       <v-data-table
          v-bind:headers="headers"
          :items="users"
          :search="searchText"
          hide-actions
          class="elevation-0"
        >
        <template slot="items" scope="props">
          <td class="text-xs-left">
            <v-btn :to="{ path: `/admin/users/${props.item.username}` }" flat class="primary--text">
              <v-icon left>open_in_new</v-icon>
              {{ props.item.s_name }} {{ props.item.f_name }}
            </v-btn>
          </td>
          <td class="text-xs-left">{{ props.item.type }}</td>
          <td class="text-xs-left">{{ props.item.computer_name }}</td>
          <td class="text-xs-left">{{ props.item.login_date | niceDate }}</td>
          <td class="text-xs-left" v-if="hoursFrom(props.item.login_date) >= 4 || daysFrom(props.item.login_date) > 0">
            <v-tooltip top>  
              <v-btn slot="activator" @click="clearOnlineUser(props.item.username)" dark small><v-icon class="">clear</v-icon> Clear</v-btn>
              <span>Sometimes a power cut occurs and when a student tries to login they are told their account is already logged in. This button only shows up when an account has been online for at least 4 hours.</span>
            </v-tooltip>
          </td>
        </template>
       </v-data-table>
     </v-card-text>
   </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data () {
      return {
        headers: [
          { text: 'Name', value: 's_name', align: 'left' },
          { text: 'Account Type', value: 'type', align: 'left' },
          { text: 'Computer Name', value: 'computer_name', align: 'left' },
          { text: 'Signed in at', value: 'login_date', align: 'left' }
        ],
        users: [],
        searchText: ''
      }
    },

    mounted () {
      this.$http.get('/users/online')
        .then(res => {
          this.users = res.data.users
        })
        .catch(console.log)
    },

    filters: {
      niceDate (value) {
        return moment().to(value)
      }
    },

    methods: {
      hoursFrom (date) {
        return moment(moment().diff(moment(date))).hour()
      },

      daysFrom (date) {
        return moment(moment().diff(moment(date))).day()
      },

      clearOnlineUser (username) {
        this.$http.put(`/users/online/${username}/clear`)
          .then(response => {
            this.users.forEach((user, i) => (user.username === username) && this.users.splice(i, 1))
          })
      }
    }
  }
</script>

<style>

</style>
