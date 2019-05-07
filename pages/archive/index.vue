<template>
  <section>
        <div v-for="(challenge,key) in challenges" :key="key" :style="{
            borderBottom: key !== challenges.length-1 
                ? '1px solid rgb(60,60,60)' 
                : '1px solid transparent'
        }">
            <div>
                <h1 class="title">{{challenge.title}}</h1>
                <h3 class="date">{{new Date(challenge.date).toLocaleString().split(',')[0]}}</h3>
            </div>
            <p class="desc">{{challenge.description}}</p>
            
            <ul v-if="challenge.rules">
                <li v-for="i in challenge.rules" :key="i">
                    {{i}}
                </li>
            </ul>

            <div class="bottom">
                <div class="winner">
                    <span class="badge">Winner</span>
                    <h3 class="username">{{`${challenge.user.username}#${challenge.user.discriminator}`}}</h3>
                    <img :src="challenge.user.avatar_url" />
                    
                    <a target="_blank" :href="challenge.winner.url" class="url">
                        <button
                            :style="{
                                backgroundImage: `url(${getName(challenge.winner.url).toLowerCase()}.svg)`
                            }"
                        ></button>
                    </a>
                </div>

                <nuxt-link tag="button" :to="`archive/${challenge.id}`" class="submit">More Submissions →</nuxt-link>
            </div>
        </div>
  </section>
</template>

<style lang="sass" scoped>
    section
        padding: 0 1em
        min-height: calc(100vh - 6em)

        ul
            padding: 0em 1em 1em
            box-sizing: border-box
            opacity: 0.6
            font-size: 12px
            letter-spacing: 0.25px

        .badge
            font-size: 14px
            background-color: rgb(25,25,25)
            padding: 5px 10px
            box-sizing: border-box
            height: 100%

        .username, .date
            opacity: 0.5
            font-size: 14px
            font-weight: 200
            margin: 0 0.7em

        & > div
            border-bottom: 1px solid rgb(60,60,60)
            padding: 2em
            max-width: 800px
            margin: 0 auto

        & > div > div
            display: flex
            justify-content: center
            align-items: center
            flex-direction: row
            width: 100%
            margin-bottom: 1em

            // @media (max-width: 650px)
            //     .date
            //         margin-right: 0
            
            span
                display: flex
                align-items: center

        h1
            font-weight: 200
            font-size: 20px

        .date
            margin-right: auto
            margin-left: 0.5em
            letter-spacing: 1px

        h2
            opacity: 0.6
            justify-content: center
    
        p
            box-sizing: border-box
            opacity: 0.6
            font-size: 14px
            width: 100%
            text-align: justify
            margin-bottom: 1em
        
        img
            height: 2.5em
            border-radius: 3em

    .bottom
        margin-bottom: 0
        flex-wrap: wrap
        align-items: center
        justify-content: space-between

        // @media (max-width: 650px)
        //     flex-direction: column
        //     justify-content: center
        //     align-items: center

        //     .submit
        //         margin: 0
        //         margin-top: 1em

        .winner
            display: flex
            align-items: center
            justify-content: flex-start
            margin-right: 1em
            margin-bottom: 0.5em
            flex-wrap: wrap

            .url
                height: 2.5em
                width: 2.5em
                margin-left: 0.3em
                
                button
                    height: 100%
                    width: 100%
                    background-size: contain
                    background-repeat: no-repeat
                    font-size: 14px
                    border: none !important
                    border-radius: 4px
                    opacity: 0.7
                    filter: invert(100%)

        span
            margin-right: 0.3em

    .submit
        font-size: 14px
        padding: 0.3em 0
        opacity: 0.5

        &:hover
            border-bottom: 1px solid white
            opacity: 0.8

        // @media (max-width: 650px)
        //     margin-top: 1em

</style>


<script>
    import Vue from 'vue'

    export default {
        data () {
            return {
                challenges: []
            }
        },

        methods: {
            getName (url) {
                return ['GitHub', 'CodePen', 'JSFiddle'][
                    ['github', 'codepen', 'jsfiddle'].indexOf(
                        url.match(/(github|codepen|jsfiddle)/i)[0]
                    )
                ]
            }
        },

        async mounted () {
            this.$store.commit('set', {
                pageTitle: 'Archive'
            })

            const data = await this.api('all-challenges')

            for (const i in data.challenges){
                const {user} = await this.api('users/' + data.challenges[i].winner.id)
                 console.log(user)
                data.challenges[i].user = user
            }
           

            if (data.success) Vue.set(
                this,
                'challenges',
                [...data.challenges,...data.challenges]
            )
        }
    }
</script>
