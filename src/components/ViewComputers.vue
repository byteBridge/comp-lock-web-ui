<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title>
        <h3 class="title"><v-icon>laptop_windows</v-icon> Computers ({{ computers.length }})</h3>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn primary class="white--text" @click="addNewComputer = true">
        <v-icon>add</v-icon> Add a new computer
      </v-btn>
    </v-toolbar>    
    <v-layout row wrap>
    <v-flex xs12 sm12>
      <v-text-field v-model="filter" style="width: 97%; margin: auto" solo placeholder="Search" prepend-icon="search"></v-text-field>
    </v-flex>
     <v-flex xs12 sm12>
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
          <v-card-media height="100px" style="background: rgba(123, 31, 162, 0.1)">
            <div class="container">
              <v-icon class="">timer</v-icon>  Added {{ computer.created_at | niceDate }} <br>
              <div v-if="computer.username">
                <v-icon>perm_identity</v-icon><router-link :to="`/admin/users/${computer.username}`">{{ computer.username }}</router-link> is online
              </div>
            </div>
          </v-card-media>
          <v-card-actions>
            <div class="text-center">
               <v-tooltip top>  
                <v-btn slot="activator" icon> <v-icon>bug_report</v-icon></v-btn>
                <span>Report problem</span>
                </v-tooltip>
                <v-tooltip top>  
                <v-btn slot="activator" icon> <v-icon>block</v-icon></v-btn>
                <span>Deactivate computer</span>
                </v-tooltip>
                <v-tooltip top>  
                <v-btn slot="activator" icon> <v-icon>delete</v-icon></v-btn>
                <span>Remove Computer</span>
                </v-tooltip>
            </div>
          </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

  <!-- Dialog to dhow hoow to add a new computer to the system -->

   <v-dialog v-model="addNewComputer" persistent max-width="500px">
        <v-card large>
          <v-card-title>
            <div class="title primary--text">How to</div>
          </v-card-title>
          <v-card-text>
            <p>Make sure the computer you want to add is connected to the same network as the server</p>
            <p>Open <b>Computer Manager</b> and login. Find the register computer menu and follow instructions</p>
            <p>
              <img src="../assets/logo.png" alt="">
            </p>
            </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green white--text darken-1" flat @click.native="addNewComputer = false">close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


  </div>
</template>

<script>
import icons from './AppIcons.vue'
import common from '@/mixins/common'
import os from 'os'
export default {
  name: 'ViewComputers',
  mixins: [common],
  components: { icons },
  mounted () {
    Object.keys(os).forEach(key => {
      console.log(key)
      console.log(typeof os[key] === 'function' && os[key]())
    })
    this.$http.get('/computers')
      .then(response => {
        this.computersData = response.data.computers
      })
      .catch(() => {})
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
      addNewComputer: false
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
  }
}
</script>

<style>

</style>
