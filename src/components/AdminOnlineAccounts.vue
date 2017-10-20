<template>
  <div>
    <v-card class="mt-2">
     <v-card-title>
      <v-toolbar dark dense class="primary">
        <v-toolbar-title>Online Accounts</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-text-field
            class="white"
            style="border-radius:2px;"
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="searchText"
          ></v-text-field>
        </v-toolbar>
     </v-card-title>
     <v-card-text>
       <v-data-table
          v-bind:headers="headers"
          :items="users"
          :search="searchText"
          hide-actions
          class="elevation-1"
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
    }
  }
</script>

<style>

</style>
