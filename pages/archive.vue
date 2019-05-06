<template>
  <section>
        <div v-for="(i,key) in challenges" :key="key" :style="{
            borderBottom: key !== challenges.length-1 
                ? '1px solid rgb(60,60,60)' 
                : '1px solid transparent'
        }">
            <div>
                <h1 class="title">{{i.title}}</h1>
                <h3 class="date">3/14/05</h3>
                <span>
                    <h3 class="username">{{`${i.user.username}#${i.user.discriminator}`}}</h3>
                    <img :src="i.user.avatar_url" />
                </span>
            </div>
            <p class="desc">{{i.description}}</p>
        </div>
  </section>
</template>

<style lang="sass" scoped>
    section
        padding: 0 1em
        min-height: calc(100vh - 6em)

        .username, .date
            opacity: 0.5
            font-size: 14px
            font-weight: 200
            margin-right: 1em

        & > div
            border-bottom: 1px solid rgb(60,60,60)
            padding: 2em

        & > div > div
            display: flex
            justify-content: center
            align-items: center
            flex-direction: row
            width: 100%
            margin-bottom: 1em
            
            span
                display: flex
                align-items: center

            @media (max-width: 650px)
                flex-direction: column


                h1
                    text-align: center

                .date
                    margin: 0.5em auto

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
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            width: 100%
        
        img
            height: 2.5em
            border-radius: 3em
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
