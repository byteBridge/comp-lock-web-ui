<template>
  <div>
    <!-- Ask for user to confirm delete action -->
    <v-layout row justify-center style="position: relative;">
      <v-dialog v-model="show" persistent max-width="500px">
          <v-alert :color="alert.type" icon="error" value="true" dismissible v-model="alert.value">
            {{ alert.message }}
          </v-alert>
        <v-card large>
          <v-card-title>
            <div class="title teal--text">Delete User</div>
          </v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete <strong>{{user.f_name}} {{user.s_name}}</strong></p>
              
            <p>
              <v-text-field
                label="Just confirm your password to continue"
                v-model="password"
                type='password'
                prepend-icon="lock"
                @keyup.native.enter="checkPassword">
              </v-text-field>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="red white--text darken-1 elevation-2" :loading="deleting" :disabled="deleting" @click.native="checkPassword">Confirm and Delete</v-btn>
            <v-btn class="green white--text darken-1" flat @click.native="$emit('close')">close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'AppConfirmDeleteTask',
    data () {
      return {
        password: '',
        show: false,
        deleting: false,
        alert: {
          value: false,
          message: '',
          type: 'info'
        }
      }
    },
    props: {
      user: Object,
      showDialog: Boolean
    },
    watch: {
      showDialog (value) {
        this.show = value
        this.password = ''
      }
    },
    methods: {
      checkPassword () {
        this.deleting = true

        // chek if the user is deleting his/her own account
        if (this.user.username === this.$store.getters.authUser.user.username) {
          this.alert.message = 'You can not delete your own account.'
          this.alert.type = 'warning'
          this.alert.value = true
          this.deleting = false
          return
        }

        // try to login to check if the password entered is correct
        this.$http.post('/auth/login', {
          username: this.$store.getters.authUser.user.username,
          password: this.password
        })

        // after a successfull vetting of the password go ahead and delete the account
        .then(res => {
          if (res.status === 200) {
            this.$http.delete(`/users/${this.user.username}`)
              .then(res => {
                this.alert.message = 'Successfully deleted account'
                this.alert.type = 'success'
                this.alert.value = true
                this.deleting = false
              })
          }
        })

        // Check if the user entered invalid details its just a server error
        .catch(error => {
          // check for invalid password
          if (error.response.status === 400 || error.response.status === 401) {
            this.alert.message = 'Invalid password. Please enter the correct password.'
            this.alert.type = 'error'
            this.alert.value = true
            this.deleting = false
            return
          }

          // a server error probably a 500
          this.alert.message = 'An Error occured that is preventing you from deleting account. Please refresh and try again. If problem persists send email to kgparadzayi@gmail.com'
          this.alert.type = 'error'
          this.alert.value = true
          this.deleting = false
        })
      }
    }
  }
</script>
