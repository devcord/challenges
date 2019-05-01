<template>
    <section>
        <h1>{{`${user.username}#${user.discriminator}`}}</h1>
        <a href="/api/logout"><h1>Log Out</h1></a>
    </section>
</template>

<style lang="sass" scoped>
    section
        height: calc(100vh - 5em)
        width: 100vw
        overflow: hidden
        display: flex
        justify-content: center
        align-items: center
        padding-bottom: 5em
        box-sizing: border-box

        h1
            font-weight: 200
            margin: 0 1em

        a
            text-decoration: none
            color: white

            &:hover
                color: cyan

            &:focus
                outline: none
</style>

<script>
    export default {
        computed: {
            user () {
                return this.$store.state.user
            }
        }
    }
</script>

