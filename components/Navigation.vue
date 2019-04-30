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

        a
            text-decoration: none

        #login-button
            width: 6.5em
            max-height: 2.3em
            background-size: auto 80%
            background-repeat: no-repeat
            outline: 0
            border: 0
            background-position: 0.5em 0.3em
            background-image: url('../static/discord_small.svg')
            box-sizing: border-box
            padding-right: 0.2em
            font-size: 1.4em
            border-radius: 4px
            display: flex
            justify-content: center
            align-items: center
            font-family: 'Uni Sans Heavy'
            letter-spacing: 0.5px
            background-color: #7289da
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

