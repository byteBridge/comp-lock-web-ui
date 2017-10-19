<template>
  <v-card>
    <v-card-title>
      User Accounts
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="searchText"
      ></v-text-field>
    </v-card-title>
    <v-card-text>
    <v-data-table
      v-bind:headers="headers"
      :items="users"
      :search="searchText"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" scope="props" @click="alert('hello world')">
      <td style="width: 20px;"><v-icon>perm_identity</v-icon></td>
      <td class="text-xs-left">{{ props.item.f_name }}</td>
      <td class="text-xs-left">{{ props.item.s_name }}</td>
      <td class="text-xs-right"><v-icon :class="{ 'red--text': props.item.blocked === true, 'green--text':props.item.blocked===false}">fiber_manual_record</v-icon></td>
      <td class="text-xs-right">{{ props.item.gender }}</td>
      <td><v-btn :to="{ path: `/admin/users/${props.item.username}` }" flat class="teal--text"><v-icon>open_in_new</v-icon> View Details</v-btn></td>
    </template>
    </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        headers: [
          { text: '', value: '' },
          { text: 'Name', value: 'f_name' },
          { text: 'Surname', value: 's_name' },
          { text: 'Blocked Status', value: 'blocked' },
          { text: 'Gender', value: 'gender' }
        ],
        users: [],
        searchText: ''
      }
    },
    mounted () {
      let config = {
        headers: { Authorization: this.$store.getters.authUser.token }
      }

      this.$http.get(`/users`, config)
        .then(res => {
          this.users = res.data.users
          console.log(res)
        })
    }
  }
</script>

<style>

</style>
