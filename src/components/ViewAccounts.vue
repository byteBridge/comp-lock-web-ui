<template>
  <v-card>
 
    <v-card-title>
      <v-toolbar dark dense class="teal">
    <v-toolbar-title>User Accounts</v-toolbar-title>
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
    <template slot="items" scope="props" @click="alert('hello world')">
      <td class="text-xs-left">
        <v-btn :to="{ path: `/admin/users/${props.item.username}` }" flat class="teal--text">
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
        <v-btn small icon v-if="props.item.blocked"><v-icon>check</v-icon></v-btn>
        <v-btn small icon v-if="!props.item.blocked"><v-icon>block</v-icon></v-btn>
        <v-btn small icon><v-icon>delete</v-icon></v-btn>
      </td>
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
          { text: 'Name', value: 's_name', align: 'left' },
          { text: 'Account Type', value: 'type', align: 'left' },
          { text: 'Gender', value: 'gender' },
          { text: 'Blocked Status', value: 'blocked' },
          { text: 'Actions', align: 'left' }
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
