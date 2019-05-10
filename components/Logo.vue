<template>
    <nuxt-link to="/" tag="section">
        <img src="@/static/icon.svg"/> <span v-show="!hideText">{{title}}</span>
    </nuxt-link>
</template>

<style lang="sass" scoped>
    section
        display: flex
        align-items: center
        justify-content: left
        font-size: 1.6em
        height: 100%
        width: auto
        cursor: pointer
        filter: saturate(70%) brightness(100%)

        img
            width: 1.1em
            padding-right: 0.3em

        span
            @media (max-width: 450px)
                display: none
</style>

<script>
    export default {
        props: ['hideText'],

        computed: {
            title () {
                return this.$store.state.pageTitle 
            } 
        },
    }
</script>
