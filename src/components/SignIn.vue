<template>
  <v-container fluid>
   <v-layout row wrap justify-center>
      <v-flex xs12 sm6>

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
            @click.native="loader = 'loading'"
            :disabled="loading"
            class="fluid button"
          >
            Accept Terms
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
        loading: false
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
