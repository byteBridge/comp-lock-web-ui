<template>
  <div>
    <h3 class="title">Create Account</h3>
    <v-stepper v-model="step" vertical>
    <v-alert
      class="mt-3 mr-3 ml-3"
      :color="`${alert.type}`"
      :icon="`${alert.icon()}`"
      dismissible
      v-model="alert.show">
      <v-icon class="white--text check" icon="person"></v-icon>
      {{ alert.message }}
    </v-alert>

    <v-stepper-step step="1" v-bind:complete="step > 1">
      Enter account information
    </v-stepper-step>
    <v-stepper-content step="1">
      <v-card class="mb-2">
          <v-card-text>
              <form>
                  <v-text-field
                  label="Name"
                  v-model="name"
                  :counter="10"
                  required
                  :rules="[rules.required]"
                  ></v-text-field>

                  <v-text-field
                  label="Surname"
                  v-model="surname"
                  required
                  :rules="[rules.required]"
                  ></v-text-field>
                  <v-select
                  label="Gender"
                  v-model="selectGender"
                  :items="gender"
                  autocomplete
                  required
                  :rules="[rules.required]"
                  ></v-select>
                    <v-select
                  label="Account Type"
                  v-model="selectAccountType"
                  :items="accountType"
                  autocomplete
                  required
                  :rules="[rules.required]"
                  ></v-select>
              </form>

          </v-card-text>
      </v-card>
      <v-btn color="primary" @click.native="gotToStep(2)"><v-icon left>keyboard_arrow_down</v-icon>Continue</v-btn>
    </v-stepper-content>
    <v-stepper-step step="2" v-bind:complete="step > 2">
      Enter Login information
    </v-stepper-step>
    <v-stepper-content step="2">
        <v-card class="mb-2">
          <v-card-text>
              <form>
                  <v-text-field
                  label="Username"
                  v-model="username"
                  prepend-icon="perm_identity"
                  :counter="10"
                  required
                  :rules="[rules.required, rules.username]"
                  ></v-text-field>

                  <v-text-field
                  label="Password"
                  type="password"
                  prepend-icon="lock_outline"
                  v-model="password"
                  loading
                  required
                  :rules="[rules.required, rules.password]"
                  >
                  <v-progress-linear slot="progress" :value="passwordProgress" height="2" :color="passwordColor"></v-progress-linear>
                  </v-text-field>
                  <v-text-field
                  label="Confirm your password"
                  type="password"
                  prepend-icon="lock_outline"
                  v-model="confirmPassword"
                  loading
                  required
                  :rules="[rules.required, rules.password, rules.matchingPassword]"
                  >
                  <v-progress-linear slot="progress" :value="confirmPasswordProgress" height="2" :color="confirmPasswordColor"></v-progress-linear>               
                  </v-text-field>
              </form>

          </v-card-text>
      </v-card>
      <v-btn @click="submit" large class="primary white--text"><v-icon left>person_add</v-icon>Create account</v-btn>
      <v-btn @click.native="step = 1" class="primary white--text"><v-icon left>keyboard_arrow_up</v-icon>Update Account Info</v-btn>
      <v-btn @click="clear" class="secondary white--text" dark><v-icon left>clear</v-icon>clear</v-btn>
    </v-stepper-content>
    
  </v-stepper>
  </div>
</template>

<script>
  /** TODO
   * - dynamicaly get theaccount types from the api
   * - make the text fields stop complaining when cleared after success
   * - ask for password confirmation to create admin account
   */
  export default {
    data () {
      return {
        name: '',
        surname: '',
        username: '',
        password: '',
        confirmPassword: '',
        selectGender: null,
        selectAccountType: null,
        gender: ['Male', 'Female'],
        accountType: ['student', 'administrator'],
        rules: {
          required: (value) => !!value || 'Required.',
          username: (value) => value.length >= 6 ? true : 'Username must be at least 6 characters',
          password: (value) => value.length >= 8 ? true : 'Password must be 8 or more characters',
          matchingPassword: (value) => value === this.password ? true : 'Your passwords must be the same'
        },
        step: 1,
        alert: {
          show: false,
          message: '',
          type: 'warning',
          icon: () => this.alert.type === 'warning' ? 'priority_high' : 'person',
          color: () => this.alert.type === 'waning'
        }
      }
    },
    computed: {
      passwordProgress () {
        return Math.min(100, this.password.length * 10)
      },
      passwordColor () {
        return ['error', 'warning', 'success'][Math.floor(this.passwordProgress / 40)]
      },
      confirmPasswordProgress () {
        return Math.min(100, this.confirmPassword.length * 10)
      },
      confirmPasswordColor () {
        return ['error', 'warning', 'success'][Math.floor(this.confirmPasswordProgress / 40)]
      }
    },
    methods: {
      submit () {
        if (!this.validateLoginInfo()) return

        this.$http.post('/auth/register', {
          f_name: this.name,
          s_name: this.surname,
          username: this.username,
          password: this.password,
          type: this.selectAccountType,
          gender: this.selectGender
        })

        .then(account => {
          this.alert.show = true
          this.alert.message = `Successfully created ${this.name} ${this.surname}'s account`
          this.alert.type = 'info'

          this.clear()
        })

        .catch(error => {
          this.alert.show = true
          this.alert.message = error.response.data.message
          this.alert.type = 'error'
        })
      },
      clear () {
        this.name = ''
        this.surname = ''
        this.username = ''
        this.password = ''
        this.confirmPassword = ''
        this.step = 1
      },
      validateAccountInfo () {
        const isValid = this.name !== '' && this.surname !== '' && this.selectGender !== null && this.selectAccountType !== null
        this.alert.show = !isValid
        this.alert.message = isValid ? '' : 'Please complete all fields for the account information'
        this.alert.type = 'warning'
        return isValid
      },
      validateLoginInfo () {
        const notEmpty = this.username !== '' && this.password !== ''
        const passwordMatch = this.password === this.confirmPassword
        this.alert.show = (!notEmpty || !passwordMatch)
        this.alert.type = 'warning'

        if (!notEmpty) {
          this.alert.message = 'Please complete all fields for the login information'
          return false
        }

        if (!passwordMatch) {
          this.alert.message = 'The passwords you entered do not match.'
          return false
        }

        return true
      },
      gotToStep (step) {
        if (step === 2) {
          if (this.validateAccountInfo()) this.step = step
        }
      }
    }
  }
</script>

<style>

</style>
