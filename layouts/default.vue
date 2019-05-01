<template>
  <div>
    <Navigation />
    <nuxt />
    <div id="copyright">
        Copyright Devcord © 2018
    </div>
  </div>
</template>

<style lang="sass" scoped>
    #copyright
        position: absolute
        bottom: 0
        text-align: center
        width: 100%
        padding-bottom: 0.5em
        letter-spacing: 0.5px
        font-size: 0.9em
        opacity: 0.5
</style>

<script>
    import Navigation from '~/components/Navigation'

    export default {
        components: {
            Navigation
        },

        async beforeMount () {
            (async () => {
                const data = await this.api(`users/@me`)

                try {
                    if (localStorage.user) this.user = JSON.parse(localStorage.user)
                } catch {}

                if (data.success) {
                    const {user} = data
                    this.$store.commit('set', {user})
                    localStorage.user = JSON.stringify(user)
                }
            })()

            ;(async () => {
                const data = await this.api(`get-challenge`)

                console.log(data)

                if (data.success) {
                    const {challenge} = data
                    this.$store.commit('set', {challenge})
                }
            })()
        }
    }
</script>

