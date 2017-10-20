<template>
  <v-container fluid>
      <v-layout row-sm column child-flex-sm>
          <v-card class="ma-3">
              <v-card-title primary-title>
                  <div class="headline">{{ authUser.user.f_name }} {{ authUser.user.s_name }}</div>
                </v-card-title>
                <v-card-text>
                  <div>
                    <v-data-table
                      :items="items"
                      hide-actions
                      class="elevation-2"
                    >
                    <template slot="items" scope="props">
                      <td><v-icon light>{{ props.item.icon }}</v-icon>  {{ props.item.name }}</td>
                      <td class="text-xs-right">{{ props.item.value }}</td>
                    </template>
                  </v-data-table> 
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn dark block class="secondary"><v-icon dark>security</v-icon> Change My Password</v-btn>
                </v-card-actions>
          </v-card>
          <v-card dark class="secondary ma-1">
            <v-card-text>two</v-card-text>
          </v-card>
      </v-layout>
  </v-container>
</template>

<script>
import user from '../modules/user'

export default {
  computed: {
    authUser () { return this.$store.getters.authUser }
  },
  mounted () {
    console.log(this.$route.params)
    // this.loadProfile()
  },
  methods: {
    loadProfile () { user.getStudentProfile('kudakwashe', this.authUser.token).then().catch() }
  },
  data () {
    return {
      items: [
        {
          name: 'Signed in at',
          value: '12:34',
          icon: 'access_time'
        },
        {
          name: 'Time left',
          value: '34 min',
          icon: 'timer'
        },
        {
          name: 'Time used',
          value: '12:34',
          icon: 'timelapse'
        }
      ]
    }
  }
}
</script>

<style>
  
</style>
