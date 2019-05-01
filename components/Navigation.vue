<template>
    <section class="navigation">
        <Logo />
        <nuxt-link to="/submit" tag="button" :class="``">
            Submit
        </nuxt-link>
        <nuxt-link to="/archive" tag="button">
            Archive
        </nuxt-link>
        <Login />
    </section>
</template>

<style lang="sass">
    section.navigation
        padding: 1em
        display: flex
        align-items: center
        justify-content: flex-end
        width: 100%
        box-sizing: border-box
        height: 5em

        section
            margin-right: auto

        button
            margin-left: 1em
            padding: 1em 2em
            font-size: 1em
            box-sizing: border-box
            height: 3em

        a
            text-decoration: none
</style>

<script>
    import Login from '~/components/Login'
    import Logo from '~/components/Logo';

    export default {
        components: {
            Logo,
            Login
        }
    }
</script>

