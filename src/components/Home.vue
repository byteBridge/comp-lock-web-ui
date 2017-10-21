<template>
  <v-card class="grey lighten-5" flat>
    <v-toolbar dark class="primary elevation-1" extended>
    </v-toolbar>
    <v-layout row>
      <v-flex xs10 offset-xs1>
        <v-card class="card--flex-toolbar">
          <v-toolbar card class="white" prominent>
            <v-toolbar-title class="body-2 grey--text">Computer Management System</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn dark class="primary white--text" @click.native="viewUserAccount">
              <v-icon>perm_identity</v-icon>
              View My account
            </v-btn>
            <v-btn  v-if="authenticated" class="secondary white--text" @click.native="signOut">
              <v-icon left dark>lock_outline</v-icon>
              Sign out</v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="title primary--text">Welcome</h3>
            <p>
              Computer Management System allows you to sign in with your username and password to use the computers responsibly, to research and learn new things.
              We believe that you will make the best out of the limited time you are provisioned by your administrators and come out tops in your academic persues.
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-toolbar dark dense class="mt-2 primary">
        <v-toolbar-title>Frequently Asked Questions</v-toolbar-title>
      </v-toolbar>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-card v-for="item in items" :key="item.title" class="mt-2 side-color">
          <v-card-title primary-title >
            <div class="body-2 primary--text">{{item.title}}</div>
            <div v-html="item.subtitle"></div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    methods: {
      viewUserAccount () {
        if (!this.$store.getters.authUser) {
          this.$router.push('/signin')
        } else {
          this.$router.push(`/users/${this.$store.getters.authUser.user.username}`)
        }
      },
      signOut () {
        this.$store.commit('setAuthUser', null)
        this.$router.push({ name: 'SignIn' })
      }
    },

    computed: {
      authenticated () {
        const authUser = this.$store.getters.authUser || null
        if (authUser && authUser.token) return true
        return false
      }
    },

    data () {
      return {
        items: [
          {
            title: 'How do i get and account',
            subtitle: "Probably you have an account by now, but if you don't have and you want a new account rush to the administrator (librarian or computer lab technician) and request an account."
          },

          {
            title: 'I have tried to sign in but failed.',
            subtitle: `
              <span>There are reasons why you could fail to sign in.</span>
              <ul>
                <li>You have entered invalid credentials</li>
                <li>You have used up all the time allocated to you for that day</li>
                <li>At some point you have misused the computer and the administrator has blocked your account</li>
                <li>Your account is logged on, on onother computer.</li>
                <li>On extremely rare occassions the computer pops error messages that you do not understand. This might be caused by an internal error within the software. The solution here is to notify the administrator as soon as possible that he may engage the Emergency Shutdown Function.</li>
              </ul>
            `
          },

          {
            title: 'I was doing my research and suddenly the computer locked. What happend?',
            subtitle: 'The time allocated to you by the administrator has expired. I recommend that you set intervals whereby you check the remaining time so that you are not caught off guard.'
          },

          {
            title: 'I have noticed an error that i think i have to report straight to the developers of this application. How do i report it?',
            subtitle: 'Send an email to Kudakwashe Paradzayi on <a href="mailto:kgparadzayi@gmail.com">kgparadzayi@gmail.com</a>'
          }
        ]
      }
    }
  }
</script>

<style scoped>
 .side-color {
   border-left-style: solid;
   border-left-color: purple;
   border-left-width: 2px;
 }
 .card--flex-toolbar {
    margin-top: -64px;
  }
</style>
