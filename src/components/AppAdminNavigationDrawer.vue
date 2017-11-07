<template>
  <div>
    <v-navigation-drawer
      permanent
      clipped
      app
      :mini-variant="drawer">

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
                <v-tooltip right>
                    <v-icon slot="activator">{{ item.icon }}</v-icon>
                    <span>{{ item.text }}</span>
                </v-tooltip>
                </v-list-tile-action>

                <v-list-tile-content>
                    <v-list-tile-title>
                    {{ item.text }}
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>

    </v-list>
   <v-divider></v-divider>
</v-navigation-drawer>

    <v-toolbar
      color="primary darken-3"
      dark
      app
      class="elevation-1"
      clipped-left
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        Computer Manager
      </v-toolbar-title>
      <!-- Only show the text field when the search api is available -->
      <v-text-field
        v-if="false"
        solo
        prepend-icon="search"
        placeholder="Search"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn flat large :to="{ path: `/users/${$store.getters.authUser.user.username}` }">
        <v-icon left>perm_identity</v-icon>
        Kudakwashe
      </v-btn>
      <v-btn flat large @click="signOut">
        Sign out
      </v-btn>
    </v-toolbar>

</div>
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
