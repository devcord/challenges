<template>
  <section>
        <div v-for="(i,key) in challenges" :key="key" :style="{
            borderBottom: key !== challenges.length-1 
                ? '1px solid rgb(60,60,60)' 
                : '1px solid transparent'
        }">
            <div>
                <h1 class="title">{{i.title}}</h1>
                <h3 class="date">{{new Date(i.date).toLocaleString().split(',')[0]}}</h3>
            </div>
            <p class="desc">{{i.description}}</p>
            <div class="bottom">
                <div class="winner">
                    <span class="badge">Winner</span>
                    <h3 class="username">{{`${i.user.username}#${i.user.discriminator}`}}</h3>
                    <img :src="i.user.avatar_url" />
                </div>

                <button class="submit">More Submissions →</button>
            </div>
        </div>
  </section>
</template>

<style lang="sass" scoped>
    section
        padding: 0 1em
        min-height: calc(100vh - 6em)

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

        async mounted () {
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
