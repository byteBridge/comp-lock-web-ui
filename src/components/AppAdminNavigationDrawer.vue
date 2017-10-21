<template>
    <v-navigation-drawer
      permanent
      light
      left
      enable-resize-watcher
      absolute
      class="elevation-1"
      style="position:fixed;"
      app clipped>
      
    <v-list dense>
        <template v-for="(item, i) in items">
            <v-layout
                row
                v-if="item.heading"
                align-center
                :key="i">

                <v-flex xs6>
                    <v-subheader v-if="item.heading">
                        {{ item.heading }}
                    </v-subheader>
                </v-flex>

                <v-flex xs6 class="text-xs-center">
                    <a href="#!" class="body-2 black--text">EDIT</a>
                </v-flex>
            </v-layout>

            <v-list-group v-else-if="item.children">
                <v-list-tile slot="item" @click="">
                    <v-list-tile-action>
                        <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ item.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>

            <v-list-tile v-else @click="goTo(item.url)" v-model="item.model">
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>
                    {{ item.text }}
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>

    </v-list>
    <v-list style="margin-top:200px;">
        <v-divider></v-divider>
        <v-subheader>Actions</v-subheader>
            <v-list-tile>
              <v-btn dark block class="primary white--text" :to="{ path: `/users/${$store.getters.authUser.user.username}` }">
              <v-icon class="white--text">perm_identity</v-icon>
              View My account
            </v-btn>
            </v-list-tile>
            <v-list-tile>
            <v-btn block class="secondary" @click.native="signOut"><v-icon left class="white--text">lock</v-icon> sign out</v-btn>
            </v-list-tile>
    </v-list>
</v-navigation-drawer>
</template>

<script>
  export default {
    data () {
      return {
        mini: true,
        drawer: true,
        dialog: false
      }
    },

    computed: {
      items () {
        return [
          {
            icon: 'account_circle',
            text: 'View Online Accounts',
            url: '/admin/users/online',
            model: this.$route.name === 'OnlineUsers'
          },
          {
            icon: 'person_add',
            text: 'Create New Account',
            url: '/admin/new-account',
            model: this.$route.name === 'NewAccount'
          },
          {
            icon: 'people',
            text: 'View Accounts',
            url: '/admin/users',
            model: this.$route.name === 'Users' || this.routeName === 'AdminUser' },
          {
            icon: 'settings',
            text: 'Settings',
            url: '/admin/settings',
            model: this.$route.name === 'Settings'
          }
        ]
      }
    },

    methods: {
      goTo (url) {
        this.$router.push({ path: url })
      },
      signOut () {
        this.$store.commit('setAuthUser', null)
        this.$router.push({ name: 'SignIn' })
      }
    }
  }
</script>
