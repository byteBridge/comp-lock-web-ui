<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar dense dark class="teal">
                    <v-toolbar-title><v-icon dark>timer</v-icon> Time limits</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <AppNewAccountType @close="getUserTypes"></AppNewAccountType>
              </v-toolbar>
            </v-card-title>

            <v-card-text>
              <v-data-table
                v-bind:headers="headers"
                :items="userTypes"
                :search="searchText"
                hide-actions
                class="elevation-1"
                >
                <template slot="items" scope="props">
                    <td class="text-xs-left"> {{ props.item.user_type }}</td>
                    <td class="text-xs-left">{{ props.item.time_limit }}</td>
                    <td>
                       <v-btn small icon><v-icon>edit</v-icon></v-btn>
                      <v-btn small icon><v-icon>delete</v-icon></v-btn>
                    </td>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
  import AppNewAccountType from '@/components/AppNewAccountType'
  export default {
    components: { AppNewAccountType },
    data () {
      return {
        headers: [
          { text: 'Account Type', value: 'user_type', align: 'left' },
          { text: 'Time limit', value: 'gender', align: 'left' },
          { text: 'Actions', align: 'left' }
        ],
        userTypes: [],
        searchText: '',
        dialog: false
      }
    },
    mounted () {
      this.getUserTypes()
    },
    methods: {
      getUserTypes () {
        this.$http.get('/users/timelimits')
        .then(res => {
          this.userTypes = res.data.data
        })
        .catch(res => console.log(res))
      }
    }
  }
</script>

<style>

</style>
