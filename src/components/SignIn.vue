<template>
  <v-container fluid>
   <v-layout row wrap justify-center>
      <v-flex xs12 sm6>
        <v-alert
          :success="alert.type === 'success'"
          :warning="alert.type === 'warning'"
          :info="alert.type === 'info'"
          :error="alert.type === 'error'"
          :value="alert.title"
          v-model="alert.title"
          transition="scale-transition"
          dismissible
        >
          {{ alert.title }}
        </v-alert>
        <v-card class="moved down">
          <v-toolbar dark class="teal darken-2">
            <v-btn icon>
              <v-icon>person</v-icon>
            </v-btn>
          </v-toolbar-title>Sign in</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-container>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Username"
                    v-model="username"
                    max="15"
                    prepend-icon="person"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Password"
                    v-model="password"
                    type='password'
                    prepend-icon="lock"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-btn
            primary
            :loading="loading"
            @click.native="signin"
            :disabled="loading"
            class="fluid button"
          >
            Sign In
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { signin } from '../modules/signin'

  export default {
    data () {
      return {
        username: '',
        password: '',
        loader: null,
        loading: false,
        alert: {
          title: '',
          type: ''
        }
      }
    },

    methods: {
      signin () {
        this.showLoader()
        signin({ username: this.username, password: this.password })
          .then(response => {
            const user = { token: response.token }
            localStorage.setItem('user', JSON.stringify(user))
            this.$router.push({ path: this.$route.query.return_to || '/' })
          })
          .catch(response => {
            this.alert = {
              title: 'error',
              type: 'error'
            }
            console.log(response)
            this.hideLoader()
          })
      },

      showLoader () {
        this.loader = 'loading'
        this.loading = !this.loading
      },

      hideLoader () {
        this.loader = null
        this.loading = false
      }
    }
  }
</script>

<style>
  .moved.down {
    margin-top: 50px
  }

  .fluid.button {
    width: 98%
  }
</style>
