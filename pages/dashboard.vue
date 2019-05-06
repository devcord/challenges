<template>
    <section>
        <img :src="user.avatar_url"/>
        <h1 class="user">{{`${user.username}#${user.discriminator}`}}</h1>
        <!-- <div class="bar"></div> -->
        <a href="/api/logout"><h1>Log Out</h1></a>
    </section>
</template>

<style lang="sass" scoped>
    section
        height: calc(100vh - 6em)
        width: 100vw
        overflow: hidden
        display: flex
        justify-content: center
        align-items: center
        padding-bottom: 2em
        box-sizing: border-box
        flex-direction: column

        .bar
            border-left: 1px solid white
            width: 0
            height: 4em

        h1
            font-weight: 200
            margin: 0
            // width: 50%
            text-align: right
            padding: 0
            padding: 10px
            font-size: 1em

        .user
            opacity: 0.5

        img
            width: 6em
            border-radius: 6em
            margin-bottom: 1em
    
        a
            text-decoration: none
            color: white
            // width: 50%
            
            h1
                text-align: left
                width: 100%

            &:hover
                color: #90CAF9

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

