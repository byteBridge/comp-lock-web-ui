<template>
  <!-- Showing loading progress -->
  <div v-if="!user.username">
    <v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
    <h3 class="title"> Loading account info. Please wait</h3>
    <v-progress-linear v-bind:indeterminate="true" color="primary"></v-progress-linear>
  </div>

  <!-- Only showing the actual content when loading's done -->
  <div v-else>
    <!-- dialog to confirm the permission to delete a user -->
    <AppConfirmDeleteUser
      :showDialog="showDeleteDialog"
      :user="user"
      @close="$router.push('/admin/users')">
    </AppConfirmDeleteUser>

    <v-toolbar flat >
    <v-btn flat :to="{ path: '/admin/users' }"><v-icon left>chevron_left</v-icon> Back</v-btn>
    <v-toolbar-title class="primary--text" >
        {{user.f_name}} {{ user.s_name}}
      <v-chip small color="primary" text-color="white">
           <v-icon class="primary--text">perm_identity</v-icon>
        {{user.type}}
      </v-chip>
    </v-toolbar-title>
    <v-spacer></v-spacer>
     <v-btn class="elevation-1 primary--text"><v-icon left class="primary--text">print</v-icon>Print Report</v-btn></vr>
      
      <!-- Blocking and unblocking user -->
      <v-btn
        v-if = "user.blocked === false"
        class="elevation-1  secondary--text"
        @click="blockUser">
        <v-icon left class="secondary--text">block</v-icon>
        Block</v-btn>

      <v-btn
        v-if = "user.blocked === true"
        class="elevation-1  green--text"
        @click="unblockUser">
        <v-icon left class="green--text">block</v-icon>
        unBlock
      </v-btn>
     
     <!-- show the delete user dialog box -->
      <v-btn class="elevation-1 red--text" @click.native="deleteUser"><v-icon left class="red--text">delete</v-icon>Delete</v-btn>
  </v-toolbar>
 
  <!-- inform the librarian so that he/she is not surprised to see missing data -->
  <v-alert color="info" icon="info" value="true" dismissible v-model="alert" v-if="user.history.length === 0">
      {{user.f_name}} {{user.s_name}}'s account has been never used to access the computers.
  </v-alert>

  <v-layout row wrap>
        <v-flex xs12 sm12>
      <v-card class="mt-2" style="height:300px;">
        <v-card-title>
          <h3 class="title">Login Activities</h3>
          <v-spacer></v-spacer>
          <v-btn-toggle v-model.number="daysBack" style="float:right;">
            <v-btn class="primary--text" flat :value="7">
              Past week
            </v-btn>
            <v-btn class="primary--text"  flat :value="14">
              Past 2 weeks
            </v-btn>
            <v-btn class="primary--text"  flat :value="30">
              Past month
            </v-btn>
            <v-btn class="primary--text"  flat :value="90">
              past 3 months
            </v-btn>
          </v-btn-toggle></v-card-title>
          <v-card-text>
        <line-chart :height="75" :data="user.history" :daysBack="Number(daysBack)" :userType="user.type"></line-chart>
          </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 sm12>
      <v-card class="mt-3">
        <v-card-title>
          <h3 class="title">History</h3>
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
              :items="user.history"
              :search="searchText"
              class="elevation-0"
            >
            <template slot="items" scope="props" @click="alert('hello world')">
              <td class="text-xs-left">{{ props.item.computer_name }}</td>
              <td class="text-xs-left">{{ props.item.log_date }}</td>
              <td class="text-xs-right">{{ props.item.start_time }}</td>
              <td class="text-xs-right">{{ props.item.duration }}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>

   
  </div>
</template>

<script>
import LineChart from '@/components/LineChart.js'
import AppConfirmDeleteUser from '@/components/AppConfirmDeleteUser'

export default {
  components: { LineChart, AppConfirmDeleteUser },
  data () {
    return {
      user: {},
      showDeleteDialog: false,
      headers: [
        { text: 'Computer Name', value: 'computer_name', align: 'left' },
        { text: 'Date', value: 'log_date', align: 'left' },
        { text: 'Time', value: 'start_time' },
        { text: 'Duration', value: 'duration' }
      ],
      pagination: {},
      searchText: '',
      daysBackList: [
        { title: 'Past week', value: 7 },
        { title: 'Past two weeks', value: 14 },
        { title: 'Past month', value: 30 },
        { title: 'Past three months', value: 90 }
      ],
      daysBack: 7,
      alert: true
    }
  },

  mounted () {
    this.$http
      .get(`/users/${this.$route.params.username}/history`, this.config)
      .then(res => {
        this.user = res.data.user
      })
      .catch(res => {
      })
  },

  computed: {
    config () {
      return {
        headers: { Authorization: this.$store.getters.authUser.token }
      }
    }
  },

  methods: {
    blockUser () {
      this.$http
        .put(`/users/${this.$route.params.username}/block`, this.config)
        .then(() => {
          this.user.blocked = true
          this.$store.commit('showAlert', {
            title: `Successfully blocked ${this.user.f_name} ${this.user.s_name}'s account`,
            type: 'success',
            show: true
          })
        })
        .catch(() => this.$store.commit('showAlert', {
          title: `An error occured and could not block ${this.user.f_name} ${this.user.s_name}'s account`,
          type: 'error',
          show: true
        }))
    },

    unblockUser () {
      this.$http // the auth headers are auto injected @ <App/>
        .put(`/users/${this.$route.params.username}/unblock`)
        .then(() => {
          this.user.blocked = false
          this.$store.commit('showAlert', {
            title: `Successfully unblocked ${this.user.f_name} ${this.user.s_name}'s account`,
            type: 'success',
            show: true
          })
        })
        .catch(() => this.$store.commit('showAlert', {
          title: `An error occured and could not unblock ${this.user.f_name} ${this.user.s_name}'s account`,
          type: 'error',
          show: true
        }))
    },

    deleteUser () {
      this.showDeleteDialog = true
    }
  }
}
</script>

<style>

</style>
