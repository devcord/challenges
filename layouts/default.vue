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
        }
    }
</script>

