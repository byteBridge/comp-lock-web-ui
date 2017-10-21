<template>
  <div>
    <!-- Ask for user to confirm change password -->
    <v-layout row justify-center style="position: relative;">
      <v-dialog v-model="show" persistent max-width="500px">
          <v-alert :color="alert.type" icon="error" value="true" dismissible v-model="alert.value">
            {{ alert.message }}
          </v-alert>
        <v-card large>
          <v-card-title>
            <div class="title primary--text">Change passoword</div>
          </v-card-title>
          <v-card-text>
            <v-divider></v-divider>
            <p>
              <br>
              Please be careful as you change your password.,Make sure you can remember it and keep it safe at ALL times. Currently there is no way to recover your password if you forget it.
              <br>
            </p>
            <v-divider class="mb-3"></v-divider>
            <p>
              <v-text-field
                label="Enter the password you are currently using"
                v-model="currentPassword"
                type='password'
                prepend-icon="lock">
              </v-text-field>

              <v-text-field
                label="Enter a new password"
                v-model="newPassword"
                type='password'
                prepend-icon="lock">
              </v-text-field>

              <v-text-field
                label="Confirm your new password to continue"
                v-model="confirmPassword"
                type='password'
                prepend-icon="lock"
                @keyup.native.enter="checkPassword">
              </v-text-field>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary white--text darken-1 elevation-2" :loading="deleting" :disabled="deleting" @click.native="checkPassword">Change password</v-btn>
            <v-btn class="primary--text darken-1" flat @click.native="$emit('close')">close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'AppChangePassword',
    data () {
      return {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
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
        this.newPassword = ''
        this.ConfirmPassword = ''
        this.currentPassword = ''
      }
    },
    methods: {
      checkPassword () {
        this.deleting = true
        this.alert.value = false

        // chek if the user is deleting his/her own account
        if (this.newPassword !== this.confirmPassword) {
          this.alert.message = 'Please enter matching passwords'
          this.alert.type = 'warning'
          this.alert.value = true
          this.deleting = false
          return
        }

        // change the password
        this.$http
          .put(`/users/${this.user.username}/password`, {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
          })
          .then(res => {
            this.alert.message = 'Successfully changed your password'
            this.alert.type = 'success'
            this.alert.value = true
            this.deleting = false
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
