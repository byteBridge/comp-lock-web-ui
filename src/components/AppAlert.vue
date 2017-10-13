<template>
  <!-- show alerts using the snackbar -->
  <v-snackbar
    :success="alert.type === 'success'"
    :warning="alert.type === 'warning'"
    :info="alert.type === 'info'"
    :error="alert.type === 'error'"
    :timeout="2000"
    bottom right
    v-model="show">
   {{ alert.title }}
   <v-btn small fab class="orange elevation-4" @click.native="alert.title = false"><v-icon dark class="white--text">cancel</v-icon></v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    name: 'AppAlert',

    data () {
      return {
        show: this.showAlert
      }
    },

    watch: {
      showAlert (value) {
        this.show = value
      },

      show (value) {
        if (value === false) {
          this.$store.commit('closeAlert')
        }
      }
    },

    props: {
      alert: Object,
      showAlert: Boolean
    }
  }
</script>
