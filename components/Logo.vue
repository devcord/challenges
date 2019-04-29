<template>
    <nuxt-link to="/" tag="section">
        <img src="@/static/icon.svg"/> <span v-show="!hideText">Devcord</span>
    </nuxt-link>
</template>

<style lang="sass" scoped>
    section
        display: flex
        align-items: center
        justify-content: left
        font-size: 2em
        height: 100%
        width: auto
        cursor: pointer
        img
            width: 1.2em
            padding-right: 0.3em
</style>

<script>
    export default {
        props: ['hideText']
    }
</script>
