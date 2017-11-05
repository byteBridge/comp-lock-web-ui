<template>
  <div>
    <v-toolbar dense class="transparent mb-2" flat>
    <v-toolbar-title><h3 class="title gray--text">User Accounts</h3></v-toolbar-title>
    <v-spacer></v-spacer>
        <v-text-field
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
    <!-- When admin want to delete account -->
    <AppConfirmDeleteUser
      :showDialog="showDeleteDialog"
      :user="userToDelete"
      @close="userToDelete = {}; showDeleteDialog = false; getUsers();">
    </AppConfirmDeleteUser>
    
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
      <td class="text-xs-right">{{ props.item.gender }}</td>
      <td class="text-xs-right">
        <v-chip v-if="props.item.blocked === true" text-color="red" color="red" outline label>Blocked</v-chip>
        <v-chip v-if="props.item.blocked === false" text-color="green" color="green" outline label>Not Blocked</v-chip>
      </td>
      <td>
        <v-btn small icon><v-icon>print</v-icon></v-btn>
        <v-btn small icon v-if="props.item.blocked" @click="unblockUser(props.item)"><v-icon>check</v-icon></v-btn>
        <v-btn small icon v-if="!props.item.blocked" @click="blockUser(props.item)"><v-icon>block</v-icon></v-btn>

        <v-btn small icon @click.native="userToDelete = props.item; showDeleteDialog = true;">
          <v-icon>delete</v-icon>
        </v-btn>
      </td>
    </template>
    </v-data-table>
    </v-card-text>
  </v-card>
  </div>
  
</template>

<script>
  import AppConfirmDeleteUser from '@/components/AppConfirmDeleteUser'
  export default {
    components: {AppConfirmDeleteUser},
    data () {
      return {
        headers: [
          { text: 'Name', value: 's_name', align: 'left' },
          { text: 'Account Type', value: 'type', align: 'left' },
          { text: 'Gender', value: 'gender' },
          { text: 'Blocked Status', value: 'blocked' },
          { text: 'Actions', align: 'left' }
        ],
        users: [],
        userToDelete: {},
        showDeleteDialog: false,
        searchText: ''
      }
    },
    mounted () {
      this.getUsers()
    },

    methods: {
      getUsers () {
        this.$http.get(`/users`)
          .then(res => {
            this.users = res.data.users
          })
      },
      blockUser (user) {
        this.$http
          .put(`/users/${user.username}/block`)
          .then(() => {
            user.blocked = true
            this.$set(this.users, this.users.findIndex(u => u.username === user.username), user)
            this.$store.commit('showAlert', {
              title: `Successfully blocked ${user.f_name} ${user.s_name}'s account`,
              type: 'success',
              show: true
            })
          })
          .catch(() => this.$store.commit('showAlert', {
            title: `An error occured and could not block ${user.f_name} ${user.s_name}'s account`,
            type: 'error',
            show: true
          }))
      },

      unblockUser (user) {
        this.$http // the auth headers are auto injected @ <App/>
          .put(`/users/${user.username}/unblock`)
          .then(() => {
            user.blocked = false
            this.$set(this.users, this.users.findIndex(u => u.username === user.username), user)
            this.$store.commit('showAlert', {
              title: `Successfully unblocked ${user.f_name} ${user.s_name}'s account`,
              type: 'success',
              show: true
            })
          })
          .catch(() => this.$store.commit('showAlert', {
            title: `An error occured and could not unblock ${user.f_name} ${user.s_name}'s account`,
            type: 'error',
            show: true
          }))
      }
    }
  }
</script>

<style>

</style>
