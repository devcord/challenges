<template>
    <a href="/api/login">
        <button id="login-button">
            Log In
        </button>
    </a>
</template>
<script>
    export default {
        data () {
            return {
                location: ''
            }
        },

        methods: {
            api: async (url, options) => await this.$axios.get({
                url: `${this.location.origin}/api/${url}`,
                ...options
            }).data
        },

        computed: {
            user () {
                return this.$store.state.user
            }
        },

        async created () {
            // this.location = location

            // const user = await this.api('users/@me')

            // if (user.success) this.$store.commit('user/set', user)

            // console.log(this.user)
        }
    }
</script>
