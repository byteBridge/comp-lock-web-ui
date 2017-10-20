<template>
  <v-container fluid>
   <v-layout row wrap justify-center>
      <v-flex xs12 sm6>
        <v-alert color="error" icon="error" value="true" dismissible v-model="showAdminAlert">
          The page you want to visit requires you to sign in as an administrator.
        </v-alert>
        <v-card  class="login container">
          <v-card-title ><h3 class="primary--text headline"> Sign in</h3></v-card-title>
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
                    @keyup.native.enter="signin"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-btn 
            block
            :loading="loading"
            @click.native="signin"
            :disabled="loading"
            style="margin: 5 0 5 0"
            class="primary white--text"
          >
            Sign In
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        username: '',
        password: '',
        loader: null,
        loading: false,
        showAdminAlert: false
      }
    },

    computed: {
      alert () { return this.$store.getters.alert },
      authUser () { return this.$store.getters.authUser }
    },

    mounted () {
      this.showAdminAlert = !!this.$route.query.requires_admin
    },
    watch: {
      authUser (authUser) {
        this.showLoader(false)
        if (authUser !== null && authUser !== undefined) {
          var returnPath = this.$route.query.return_to
          var { type, username } = authUser.user

          // route the user to the relevant routes
          if (!returnPath && type === 'administrator') {
            returnPath = 'admin'
          }
          if (!returnPath && type !== 'administrator') {
            returnPath = `users/${username}`
          }

          this.$router.push({ path: returnPath })
        }
      },

      alert (value) {
        if (value.show === true) { this.showLoader(false) }
      }
    },

    methods: {
      signin () {
        this.showLoader(true)
        let credentials = { username: this.username, password: this.password }
        this.$store.dispatch('signIn', credentials)
      },

      showLoader (value) {
        this.loader = value === true ? 'loading' : null
        this.loading = value
      }
    }
  }
</script>

<style>
  .login.container {
    max-width: 450px;
    margin-top: 10px; 
    min-width: 300px;
  }
</style>
