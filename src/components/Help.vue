<template>
  <div>
    <v-container fluid>
       <v-card>
         <v-toolbar><v-toolbar-title>Frequently Asked Questions</v-toolbar-title></v-toolbar>
          <v-layout row wrap>
            <v-flex xs12 v-for="item in items">
              <v-card>
                <v-card-title primary-title>
                  <div class="body-2 teal--text">{{item.title}}</div>
                  <div v-html="item.subtitle"></div>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-layout>
      </v-card> 
    </v-container>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        drawer: null,
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
        ],
        right: null
      }
    }
  }
</script>
