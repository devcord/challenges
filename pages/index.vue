<template>
    <section>
        <div v-if="Object.keys(challenge).length > 0">
            <h1>{{challenge.title}}
            <span class="badge">{{
                challenge.end - Date.now() > 0 ? 'Submitting' : 'Voting'
            }}</span>
            
            <span v-if="challenge.end - Date.now() > 0" class="timer">{{timer || '00:00:00:00'}}</span>
            <span v-else class="timer ended"></span>
            </h1>
            <p v-html="challenge.description"></p>
            <h1>Rules</h1>
            <ul v-if="challenge.rules">
                <li v-for="i in challenge.rules" :key="i">
                    {{i}}
                </li>
            </ul>

            <nuxt-link 
                :to="challenge.end - Date.now() > 0 ? '/submit' : '/vote'" 
                tag="button" 
                class="submit">
                {{challenge.end - Date.now() > 0 ? 'Submit your project' : 'Vote for a project'}}
            </nuxt-link>
        </div>
        <div v-else>
            <h2>No challenge found.</h2>
        </div>
    </section>
</template>


<style lang="sass" scoped>
    section
        height: auto
        min-height: calc(100vh - 6em)
        box-sizing: border-box
        overflow: hidden
        overflow-y: auto

        .badge
            font-size: 14px
            margin-left: 1em
            background-color: rgb(25,25,25)
            padding: 5px 10px
            box-sizing: border-box
            height: 100%

        div
            height: auto
            min-height: calc(100vh - 6em)
            display: flex
            width: 90vw
            max-width: 800px
            align-items: flex-start
            justify-content: center
            flex-direction: column
            margin: auto
            padding: 2em 0
            box-sizing: border-box
    
        p
            width: 90vw
            max-width: 800px
            padding: 1em
            box-sizing: border-box
            margin-bottom: 2em
            text-align: justify

        h1, h2
            font-weight: 200
            width: 100%
            display: flex
            align-items: center
            justify-content: left
            flex-wrap: wrap

            @media (max-width: 650px)
                display: inline-block
                text-align: center

            .timer
                display: flex
                margin-left: auto
                font-family: 'Source Code Pro'
                font-weight: 200
                align-items: center
                opacity: 0.8

                @media (max-width: 650px)
                    margin-left: 0
                    justify-content: center

                &::before
                    content: 'Ends in '
                    font-family: 'Montserrat'
                    margin-right: 0.5em
                    font-size: 0.6em
                    letter-spacing: 0.4px
                    padding-top: 0.4em
                    opacity: 0.5

        h2
            opacity: 0.6
            justify-content: center

        .timer.ended
            &::before
                content: 'Ended'

        ul
            padding: 0 2em
            padding-top: 1em
            box-sizing: border-box

        p, ul
            opacity: 0.6
            font-size: 14px


        .submit
            margin: 2em auto 0
            font-size: 1em
            padding: 1em
            background-color: rgb(25,25,25)
            border: none !important
            transition: background-color 0.1s, color 0.1s
            border-radius: 4px

            &:hover
                background-color: white
                color: rgb(30,30,30)

</style>

<script>
    import Vue from 'vue'

    export default {
        data () {
            return {
                timer: false
            }
        },

        computed: {
            user () {
                return this.$store.state.user
            },

            challenge () {
                return this.$store.state.challenge
            }
        },

        beforeMount() {
            if (process.client) this.window = window
        },

        methods: {
            advanceTimer () {
                if (this.challenge.end) Vue.set(
                    this,
                    'timer',
                    [
                        /* Days */
                        (Math.floor((
                            this.challenge.end - Date.now())/ 86400000
                        )+"").padStart(2,'0'),

                        /* HH, MM, SS */
                        ...new Date(
                            this.challenge.end - Date.now()
                        ).toUTCString().split(' ')[4].split(':')
                    ].join(':')
                )
            }
        },

        mounted () {
            setInterval(this.advanceTimer, 20)

            this.$store.commit('set', {
                pageTitle: 'Home'
            })
        }
    }
</script>
