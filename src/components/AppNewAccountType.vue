<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-alert :color="alert.type" icon="error" value="true" dismissible v-model="alert.value">
        {{ alert.message }}
      </v-alert>
      <v-card-title>
        <div v-if="isEdit" class="headline teal--text">Update time limits</div>
        <div v-else class="headline teal--text">New account type</div>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Enter account name"
              hint="At least 3"
              v-model="userType"
              min="3"
              :readonly = "isEdit"
            ></v-text-field>
          </v-flex>

          <v-flex xs4 sm4 class="mr-3">
            <v-select
              v-bind:items="hours"
              v-model="selectedHours"
              label="Hours"
              autocomplete
            ></v-select>
          </v-flex>

          <v-flex xs4 sm4>
            <v-select
              v-bind:items="minutes"
              v-model="selectedMinutes"
              label="Minutes"
              autocomplete
            ></v-select>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="teal white--text darken-1" v-if="isEdit" @click.native="editTimeLimits">Update</v-btn>
        <v-btn class="teal white--text darken-1" v-else @click.native="createUserType">Create</v-btn>
        <v-btn class="teal--text darken-2" flat="flat" @click.native="exit">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      show: Boolean,
      isEdit: Boolean,
      editUserType: Object
    },
    watch: {
      show (value) {
        this.dialog = value

        if (this.isEdit === true) {
          this.userType = this.editUserType.user_type
          let time = this.editUserType.time_limit.split(':')
          this.selectedHours = Number(time[0])
          this.selectedMinutes = Number(time[1])
        } else {
          this.userType = ''
          this.selectedHours = ''
          this.selectedMinutes = ''
        }
      }
    },
    data () {
      return {
        dialog: false,
        userType: '',
        minutes: this.iterateTo(59),
        hours: this.iterateTo(5),
        selectedMinutes: '',
        selectedHours: '',
        alert: {
          value: false,
          message: '',
          type: 'info'
        }
      }
    },
    methods: {
      iterateTo (value) {
        var array = []
        for (let i = 0; i < value + 1; i++) {
          array.push(i)
        }
        return array
      },

      createUserType () {
        if (this.selectedHours.length === 0 || this.selectedMinutes.length === 0) {
          this.alert.message = 'Please fill in all the fields'
          this.alert.type = 'warning'
          this.alert.value = true
          return
        }

        this.$http.post('/users/timelimits/new', {
          userType: this.userType,
          timeLimits: `${this.selectedHours}:${this.selectedMinutes}`
        })
        .then(res => {
          this.alert.message = res.data.message
          this.alert.type = 'success'
          this.alert.value = true

          this.clear()
        })
        .catch(res => {
          this.alert.message = res.response.data.message || 'An error occured.'
          this.alert.type = 'error'
          this.alert.value = true
        })
      },

      editTimeLimits () {
        if (this.selectedHours.length === 0 || this.selectedMinutes.length === 0) {
          this.alert.message = 'Please fill in all the fields'
          this.alert.type = 'warning'
          this.alert.value = true
          return
        }

        this.$http.put(`/users/timelimits/${this.userType}`, {
          timeLimits: `${this.selectedHours}:${this.selectedMinutes}`
        })
        .then(res => {
          this.alert.message = res.data.message
          this.alert.type = 'success'
          this.alert.value = true
        })
        .catch(res => {
          this.alert.message = res.response.data.message || 'An error occured.'
          this.alert.type = 'error'
          this.alert.value = true
        })
      },

      clear () {
        this.userType = ''
        this.selectedHours = ''
        this.selectedMinutes = ''
        this.isEdit = false
      },

      exit () {
        this.dialog = false
        this.alert.value = false
        this.clear()
        this.$emit('close')
      }
    }
  }
</script>

<style>

</style>
