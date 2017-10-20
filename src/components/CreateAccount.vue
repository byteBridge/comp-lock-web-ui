<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-toolbar dense dark class="primary">
          <v-toolbar-title>Create New Account</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
    <v-card-text>
    <v-layout>
        <v-flex xs12 sm6>
            <v-card class="mr-2">
                <v-card-title>
                    <h3 class="title">Personal information</h3>
                </v-card-title>
                <v-card-text>
                    <form>
                        <v-text-field
                        label="Name"
                        v-model="name"
                        :counter="10"
                        required
                        ></v-text-field>

                        <v-text-field
                        label="Surname"
                        v-model="surname"
                        required
                        ></v-text-field>
                        <v-select
                        label="Gender"
                        v-model="selectGender"
                        :items="gender"
                        autocomplete
                        required
                        ></v-select>
                          <v-select
                        label="Account Type"
                        v-model="selectAccountType"
                        :items="accountType"
                        autocomplete
                        required
                        ></v-select>
                    </form>

                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 sm6>
            <v-card>
                <v-card-title>
                    <h3 class="title">Login nformation</h3>
                </v-card-title>
                <v-card-text>
                    <form>
                        <v-text-field
                        label="Username"
                        v-model="username"
                        :counter="10"
                        required
                        ></v-text-field>
                        <v-text-field
                        label="Password"
                        type="password"
                        v-model="password"
                        required
                        ></v-text-field>
                    </form>

                </v-card-text>
            </v-card>

            <v-card class="mt-3">
                <v-card-text>
                    <v-btn @click="submit" class="primary white--text" block>submit</v-btn>
                    <v-btn @click="clear" block class="secondary white--text" dark>clear</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
    </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { stringify } from 'querystring'

  export default {
    data () {
      return {
        name: '',
        surname: '',
        username: '',
        password: '',
        selectGender: null,
        selectAccountType: null,
        gender: ['Male', 'Female'],
        accountType: ['student', 'administrator']
      }
    },
    methods: {
      submit () {
        let config = {
          headers: { Authorization: this.$store.getters.authUser.token }
        }
        console.log(this.name, this.surname, this.username, this.password, this.selectGender, this.selectAccountType)
        this.$http.post('/auth/register',
          stringify({
            f_name: this.name,
            s_name: this.surname,
            username: this.username,
            password: this.password,
            type: this.selectAccountType,
            gender: this.selectGender
          }),
          config)
        .then(account => {
          this.$store.commit('showAlert', {
            title: `Successfully created ${this.name} ${this.surname}'s account`,
            type: 'info',
            show: true
          })
          this.clear()
          console.log(account)
        })
        .catch(error => {
          this.$store.commit('showAlert', {
            title: error.response.data.message,
            type: 'warning',
            show: true
          })
          console.log(error.response)
          console.log(error.config)
        })
      },
      clear () {
        this.name = ''
        this.surname = ''
        this.username = ''
        this.password = ''
      }
    }
  }
</script>

<style>

</style>
