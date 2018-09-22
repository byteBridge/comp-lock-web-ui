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
            <td class="text-xs-left">
              <v-btn primary @click="takeScreenshot(props.item.username)"><v-icon>camera</v-icon> Take screenshot</v-btn>
              <v-btn @click="clearOnlineUser(props.item.username)" dark><v-icon class="">clear</v-icon> Logout  </v-btn>
            </td>
          </template>
        </v-data-table>

      <!-- Dialog to dhow hoow to add a new computer to the system -->

      <v-dialog v-model="openScreenshotDialog"  max-width="900px">
        <v-card large>
          <v-card-text>
          <v-toolbar  class="mb-3 white" flat>
            <v-toolbar-title>
              <div class="">
                Screenshot for 
                <span class="primary--text"> {{ screenshotStudent.f_name }} {{ screenshotStudent.s_name }} </span>
                on computer
                <span class="primary--text"> {{ screenshotStudent.computer_name}} </span>
              </div>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="green white--text darken-1" flat @click.native="closeScreenshotDialog()">close</v-btn>
          </v-toolbar>

          <div style=" background: purple; border-radius: 1000px; height: 2px; width: 96%; margin: 0 auto 50px auto"></div>
            
          <div class="container">
            <div v-if="imageUrl === ''">
              <v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
              <v-progress-linear v-bind:indeterminate="true" color="primary"></v-progress-linear>
            </div>
              <!-- Temporary delete me after -->
              <img :src="imageUrl" width="100%" alt="Image loading...">
          </div>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-card-text>
   </v-card>
  </div>
</template>

<script>
  import { io } from '@/modules/socket.io-client'
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
        searchText: '',
        imageUrl: '',
        openScreenshotDialog: false,
        screenshotStudent: {},
        io
      }
    },

    mounted () {
      this.$http.get('/users/online')
        .then(res => {
          this.users = res.data.users
        })
        .catch(console.log)

      const self = this
      this.io.on('took-screenshot', function (data) {
        const screenshot = JSON.parse(data)
        self.imageUrl = `data:image/png;base64,${screenshot.imageUrl}`
      })
    },

    filters: {
      niceDate (value) {
        return moment().to(value)
      }
    },

    methods: {
      clearOnlineUser (username) {
        // emit event to the desktop client to logout the user
        io.emit('logout', username)

        // and then clear their record from online users
        this.$http.put(`/users/online/${username}/clear`)
          .then(response => {
            // then remove the user from the user list in state
            this.users.forEach((user, i) => (user.username === username) && this.users.splice(i, 1))
          })
      },

      takeScreenshot (username) {
        this.openScreenshotDialog = true
        this.screenshotStudent = this.users.find(user => username === user.username)
        setTimeout(() => {
          io.emit('take-screenshot', username)
        }, 1000)
      },

      // close dialog and reset
      closeScreenshotDialog () {
        this.openScreenshotDialog = false
        this.screenshotStudent = {}
        this.imageUrl = ''
      }
    }
  }
</script>

<style>

</style>
