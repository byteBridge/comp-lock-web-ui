<template>
  <div>
    hey you are viewing {{$route.params.username}}'s account
    {{user}}
  </div>
</template>

<script>
export default {
  data () {
    return { user: {} }
  },
  mounted () {
    this.$http
      .get(`/users/${this.$route.params.username}/history?token=${this.$store.getters.authUser.token}`)
      .then(res => {
        this.user = res.data.user
      })
  }
}
</script>

<style>

</style>
