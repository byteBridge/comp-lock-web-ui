<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title>
        <h3 class="title"><v-icon>laptop_windows</v-icon> Computers ({{ computers.length }})</h3>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn primary class="white--text" @click="getAllComputers">
        <v-icon>refresh</v-icon> Refresh
      </v-btn>
      <v-btn primary class="white--text" @click="addNewComputer = true">
        <v-icon>add</v-icon> Add a new computer
      </v-btn>
    </v-toolbar>    
    <v-layout row wrap>
    <v-flex xs12 sm12>
      <v-text-field v-model="filter" style="width: 97%; margin: auto" solo placeholder="Search" prepend-icon="search"></v-text-field>
    </v-flex>
     <v-flex xs12 sm12>
      <v-btn class="ma-3 white elevation-1"  @click="filter=''"><v-icon color="grey">fiber_manual_record</v-icon> All Computers</v-btn>
      <v-btn class="ma-3 white elevation-1"  @click="filter='available'"><v-icon :color="statusColors['available']">fiber_manual_record</v-icon> Available</v-btn>
      <v-btn class="ma-3 white elevation-1"  @click="filter='in_use'"><v-icon :color="statusColors['in_use']" >fiber_manual_record</v-icon> Computer in use </v-btn>
      <v-btn class="ma-3 white elevation-1" @click="filter='deactivated'"><v-icon :color="statusColors['deactivated']"  >fiber_manual_record</v-icon> Computer deactivated </v-btn>
    </v-flex>
    <v-flex xs12 sm4 md3 v-for="computer in computers" :key="computer.id">
      <v-card class="ma-3">
          <v-card-title class="">
            <b>{{ computer.name }}</b>
            <v-spacer/>
            <v-icon :color="statusColors[computer.status]">fiber_manual_record</v-icon>
            {{ computer.status.split('_').join(' ') }}
          </v-card-title>
          <v-card-media class="computer-card">
            <div class="container">
              <v-icon class="">timer</v-icon>  Added {{ computer.created_at | niceDate }} <br>
              <div v-if="computer.username">
                <v-icon>perm_identity</v-icon><router-link :to="`/admin/users/${computer.username}`">{{ computer.username }}</router-link> is online
              </div>
              <div v-if="computer.last_used_by">
                <v-icon>person</v-icon> Last used by <router-link :to="`/admin/users/${computer.last_used_by}`">{{ computer.last_used_by }}</router-link> {{ computer.last_used_time | niceDate }}
              </div>
            </div>
          </v-card-media>
          <v-card-actions class="grey darken-2">
            <v-spacer></v-spacer>
            <div class="text-center">
               <v-tooltip top>  
                </v-tooltip>
                <v-tooltip top  v-if="computer.status !== 'deactivated'">  
                <v-btn slot="activator" @click="deactivateComputer(computer.name)" icon> <v-icon color="orange">block</v-icon></v-btn>
                <span>Deactivate computer</span>
                </v-tooltip>
                <v-tooltip top  v-else>  
                <v-btn slot="activator" @click="reactivateComputer(computer.name)" icon> <v-icon color="green">done_all</v-icon></v-btn>
                <span>Reactivate computer</span>
                </v-tooltip>
                <v-tooltip top>  
                <v-btn slot="activator" icon> <v-icon color="red">delete</v-icon></v-btn>
                <span>Remove Computer</span>
                </v-tooltip>
            </div>
          </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

  <!-- Dialog to dhow hoow to add a new computer to the system -->

   <v-dialog v-model="addNewComputer" persistent max-width="900px">
        <v-card large>
          <v-card-text>
          <v-toolbar  class="mb-3" flat>
            <v-toolbar-title>
              <div class="title primary--text">How to register </div></v-toolbar-title>
          <v-spacer></v-spacer>
           <v-btn class="green white--text darken-1" flat @click.native="addNewComputer = false">close</v-btn>

            </v-toolbar>
            <h3 class="title">Method 1 (recommended way)</h3>
            <p>Make sure the computer you want to add is connected to the same network as the server</p>
            <p>Open <b>Computer Manager</b> and login. Find the register computer menu and follow instructions</p>
            <p>
              <img src="../assets/RegisterComputer.png" alt="">
            </p>

            <h3 class="title">Method 2</h3>
            <div class="container">
              <v-alert :color="alert.type" icon="error" value="true" dismissible v-model="alert.value">
                {{ alert.message }}
              </v-alert>
              <p>Type in the computer name in the text field below ( keep in mind this method is <code>Case Sensitive</code>).</p>
              <p> The computer name can be found by clicking on the start menu</p>
              <v-text-field label="Computer Name" placeholder="Enter computer name" v-model="computerName"></v-text-field>
              <v-btn class="primary white--text darken-1" block :loading="registering" :disabled="registering" @click.native="registerComputer">Register Computer</v-btn>

            </div>

            </v-card-text>
        </v-card>
      </v-dialog>


  </div>
</template>

<script>
import common from '@/mixins/common'
export default {
  name: 'ViewComputers',
  mixins: [common],
  mounted () {
    this.getAllComputers()
  },
  data () {
    return {
      filter: '',
      statusColors: {
        available: 'green',
        'in_use': 'orange',
        deactivated: 'red'
      },
      computersData: [],
      addNewComputer: false,
      computerName: '',
      registering: false,
      alert: {
        type: '',
        message: '',
        value: false
      }
    }
  },
  computed: {
    computers () {
      return this.computersData.filter(computer => {
        console.log(computer.name)
        return (
          computer.name.toLowerCase().trim().indexOf(this.filter.toLowerCase().trim()) > -1 ||
          computer.status.toLowerCase().trim().indexOf(this.filter.toLowerCase().trim()) > -1
        )
      })
    }
  },

  methods: {
    getAllComputers () {
      this.$http.get('/computers')
      .then(response => {
        this.computersData = response.data.computers
      })
      .catch(() => {})
    },

    deactivateComputer (computerName) {
      this.$http.put('/computers/deactivate', {
        name: computerName
      }).then(response => {
        this.computersData.find(c => c.name === computerName).status = 'deactivated'
      })
    },

    reactivateComputer (computerName) {
      this.$http.put('/computers/reactivate', {
        name: computerName
      }).then(response => {
        this.computersData.find(c => c.name === computerName).status = 'available'
      })
    },

    registerComputer () {
      this.registering = true
      this.$http.post('/computers/new', {
        name: this.computerName
      }).then(response => {
        this.computerName = ''
        this.alert.message = response.data.message
        this.alert.value = true
        this.alert.type = 'success'

        this.registering = false
      }).catch(error => {
        this.alert.message = 'Could not register the computer. Consider using Method 1'
        this.alert.value = true
        this.alert.type = 'error'
        console.log(error)
        this.registering = false
      })
    }
  }
}
</script>

<style>
  .computer-card {
    background: rgba(123, 31, 162, 0.1);
  }
</style>
