<template>
    <div>
        <a href="/api/login" v-if="Object.keys(user).length < 1">
            <button id="login-button">
                Log In
            </button>
        </a>

        <nuxt-link 
            to="/dashboard" 
            tag="button" 
            :title="`${user.username}#${user.discriminator}`" 
            id="avatar" 
            :style="{
                backgroundImage: `url(${user.avatar_url})`
            }" v-else>
        </nuxt-link>
    </div>
</template>

<style lang="sass" scoped>
    div
        height: 3em

    #login-button
        width: 6.5em
        padding: 0
        height: 2.2em
        background-size: auto 80%
        background-repeat: no-repeat
        outline: 0
        border: 0
        background-position: 0.7em 0.3em
        background-image: url('../static/discord_small.svg')
        box-sizing: border-box
        font-size: 1.4em
        padding-right: 0.8em
        border-radius: 4px
        display: flex
        justify-content: flex-end
        align-items: center
        font-family: 'Uni Sans Heavy'
        letter-spacing: 0.5px
        background-color: #7289da

    #avatar
        width: 3em
        height: 3em
        background-size: contain
        background-position: center center
        background-repeat: no-repeat
        padding: 0
        border-radius: 3em
        border: none

        &:hover
            border: none

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
