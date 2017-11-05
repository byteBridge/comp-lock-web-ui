<template>
    <div>
        <!-- Show the dialog to add/update timelimits -->
        <AppNewAccountType
          :show="userTypeDialog.show"
          :isEdit="userTypeDialog.isEdit"
          :editUserType="userTypeDialog.userType"
          @close="getUserTypes">
        </AppNewAccountType>

        <v-toolbar dense class="transparent mb-2" flat>
          <v-toolbar-title>
            <v-icon light>timer</v-icon> Time limits</v-toolbar-title>
            <v-spacer></v-spacer>
          <v-btn dark class="primary white--text" @click="showUserTypeDialog({}, false)"><v-icon>add</v-icon>New account type</v-btn>
        </v-toolbar>
        <v-card>
            <v-card-text>
              <v-data-table
                v-bind:headers="headers"
                :items="userTypes"
                :search="searchText"
                hide-actions
                class="elevation-0"
                >
                <template slot="items" scope="props">
                    <td class="text-xs-left"> {{ props.item.user_type }}</td>
                    <td class="text-xs-left">{{ props.item.time_limit }}</td>
                    <td>
                       <v-btn
                       block flat
                       @click="showUserTypeDialog(props.item, true)"><v-icon left >edit</v-icon> edit</v-btn>
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
          { text: 'Time limit', value: 'gender', align: 'left' }
        ],
        userTypes: [],
        searchText: '',
        userTypeDialog: {
          show: false,
          isEdit: false,
          userType: {} // user_type, time_limit
        }
      }
    },
    mounted () {
      this.getUserTypes()
    },
    methods: {
      getUserTypes () {
        // just to reset
        this.userTypeDialog.show = false

        this.$http.get('/users/timelimits')
        .then(res => {
          this.userTypes = res.data.data
        })
        .catch(res => console.log(res))
      },

      showUserTypeDialog ({ user_type, time_limit }, isEdit) {
        this.userTypeDialog.isEdit = !!isEdit
        this.userTypeDialog.userType = { user_type, time_limit }
        this.userTypeDialog.show = true
      }
    }
  }
</script>

<style>

</style>
