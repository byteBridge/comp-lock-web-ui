<template>
    <v-navigation-drawer
      permanent
      light
      right
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
</v-navigation-drawer>
</template>

<script>
  export default {
    data () {
      return {
        mini: true,
        drawer: true,
        dialog: false,
        items: [
           { icon: 'timeline', text: 'Overview', url: '/admin', model: true },
           { icon: 'person_add', text: 'Create Account', url: '/admin/new-account', model: false },
           { icon: 'people', text: 'View Account', url: '/admin/users', model: false },
           { icon: 'settings', text: 'Settings', url: '/admin/settings', model: false }
        ]
      }
    },
    methods: {
      goTo (url) {
        this.$router.push({ path: url })
      }
    }
  }
</script>
