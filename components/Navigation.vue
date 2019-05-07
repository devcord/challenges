<template>
    <section class="navigation">
        <Logo />

        <nuxt-link to="/submit" alt="Submit" title="Submit" tag="button" :class="``" :style="{
            backgroundImage: 'url(plus.svg)'
        }"></nuxt-link>

        <nuxt-link to="/vote" alt="Vote" title="Vote" tag="button" :class="``" :style="{
            backgroundImage: 'url(heart.svg)'
        }"></nuxt-link>

        <nuxt-link to="/archive" alt="Archive" title="Archive" tag="button" :style="{
            backgroundImage: 'url(grid.svg)'
        }"></nuxt-link>

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
        height: 4em

        section
            margin-right: auto

        button
            margin-left: 1em
            width: 2.5em
            font-size: 1em
            box-sizing: border-box
            height: 2.5em
            background-repeat: no-repeat
            background-position: center center
            border-bottom: transparent

        & > button
            margin-left: 0.5em
            filter: invert(100%)
            background-size: 55%
            image-rendering: optimizeQuality
            border-radius: 3em

            &:hover
                border-bottom: transparent
                // background-color: white
                // filter: invert(0%)

            @media (max-width: 600px)
                padding: 0 1em
                margin-left: 0.5em
                font-size: 0.9em

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

