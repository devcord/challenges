<template>
  <section>
  </section>
</template>
<script>
    export default {
        async fetch ({ store, params }) {
            if (store.$cookies.get('discord_code')) {
                console.log('axios start')
                const userData = await store.$axios.get('http://localhost:3000/api/auth')
                console.log('axios done')
                store.commit('user/set', userData)
                console.log('commit done')
            }
        },

        computed: {
            user () {
                return this.$store.state.user
            }
        },

        created () {
            console.log(this.user)
        }
    }
</script>
