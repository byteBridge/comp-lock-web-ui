<template>
  <div>
    <v-toolbar class="teal--text">
      <v-icon class="teal--text">perm_identity</v-icon>
        {{user.f_name}} {{ user.s_name}}
      <v-chip small label outline class="teal">{{user.type}}</v-chip>
      <v-spacer></v-spacer>
      <v-btn class="elevation-1 teal--text"><v-icon left class="teal--text">print</v-icon>Print Report</v-btn></vr>
      <v-btn class="elevation-1  orange--text"><v-icon left class="orange--text">block</v-icon>Block</v-btn>
      <v-btn class="elevation-1 red--text"><v-icon left class="red--text">delete</v-icon>Delete</v-btn>
    </v-toolbar>
  
  <v-card v-if="user.history"  class="mt-2" style="height:300px;">
      <v-btn-toggle v-model.number="daysBack" style="float:right;">
        <v-btn class="teal--text" flat :value="7">
          Past week
        </v-btn>
        <v-btn class="teal--text"  flat :value="14">
          Past 2 weeks
        </v-btn>
        <v-btn class="teal--text"  flat :value="30">
          Past month
        </v-btn>
        <v-btn class="teal--text"  flat :value="90">
          past 3 months
        </v-btn>
      </v-btn-toggle>
    <line-chart :height="110" :data="user.history" :daysBack="daysBack"></line-chart>
  </v-card>
   <v-card  v-if="user.history" class="mt-2">
     <v-card-title>
       History
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
          v-bind:pagination.sync="pagination"
          hide-actions
          class="elevation-1"
        >
        <template slot="items" scope="props" @click="alert('hello world')">
          <td class="text-xs-left">{{ props.item.computer_name }}</td>
          <td class="text-xs-left">{{ props.item.log_date }}</td>
          <td class="text-xs-right">{{ props.item.start_time }}</td>
          <td class="text-xs-right">{{ props.item.duration }}</td>
        </template>
        <template slot="pageText" scope="{ pageStart, pageStop }">
          From {{ pageStart }} to {{ pageStop }}
        </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
     </v-card-text>
   </v-card>

    <v-card class="mt-2" v-else>
      <v-card-text>{{user.f_name}} {{user.s_name}}'s account has never used to access the computers.</v-card-text>
    </v-card>
  </div>
</template>

<script>
import LineChart from '@/components/LineChart.js'
export default {
  components: { LineChart },
  data () {
    return {
      user: {},
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
      daysBack: 7
    }
  },
  mounted () {
    let config = {
      headers: { Authorization: this.$store.getters.authUser.token }
    }

    this.$http
      .get(`/users/${this.$route.params.username}/history`, config)
      .then(res => {
        this.user = res.data.user
      })
      .catch(res => {
      })
  }
}
</script>

<style>

</style>
