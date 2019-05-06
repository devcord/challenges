<template>
    <section>
        <section class="filter">
            <button :class="`filter${filter === 'date' ? ' active' : ''}`" @click="setFilter('date')">
                Date
            </button>
            <button :class="`filter${filter === 'upvotes' ? ' active' : ''}`" @click="setFilter('upvotes')">
                Upvotes
            </button>
            <button :class="`filter${filter === 'random' ? ' active' : ''}`" @click="setFilter('random')">
                Random
            </button>
        </section>
        <div v-for="(i,key) in submissions.sort(
            (a,b) => 
                  filter === 'date' ? b.date - a.date 
                : filter === 'upvotes' ? Object.keys(b.upvotes).length - Object.keys(a.upvotes).length
                : 0.5 - Math.random()
        )" :key="key" :style="{
                backgroundImage: `url(${i.user.avatar_url}?size=512)`
            }">
            <!-- <img :src="i.user.avatar_url" /> -->
            <div class="info">
                <h1 class="title">
                    {{i.title}}
                    <!-- <span class="date">{{new Date(i.date).toLocaleString().split(',')[0]}}</span> -->
                </h1>
                <h1 class="username">{{i.user.username}}#{{i.user.discriminator}}</h1>
                <!-- <p class="description">{{i.description}} </p> -->
                <a target="_blank" :href="i.url" class="url">
                    <button
                        :style="{
                            backgroundImage: `url(${getName(i.url).toLowerCase()}.svg)`
                        }"
                    ></button>
                </a>
                <div class="upvote" v-if="canUpvote">
                    <span>{{Object.keys(i.upvotes).length}}</span>
                    <button 
                        :vote="user.id && i.id !== user.id ? 'true' : 'false'" 
                        @click="upvote(i.id,key)"
                        :style="{
                            filter: i.upvotes.indexOf(user.id) > -1 ? 'invert(10%)' : 'invert(100%)'
                        }"
                    ></button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'

export default {
        props: ['submissions', 'canUpvote'],

        data () {
            return {
                filter: 'date'
            }
        },

        methods: {
            getName (url) {
                return ['GitHub', 'CodePen', 'JSFiddle'][
                    ['github', 'codepen', 'jsfiddle'].indexOf(
                        url.match(/(github|codepen|jsfiddle)/i)[0]
                    )
                ]
            },

            async upvote (id,key) {
                try {
                    const data = await this.api('upvote/' + id, {
                        method: 'post'
                    })

                    if (data.success)
                        Object.assign(
                            this.submissions[key],
                            {upvotes: data.upvotes}
                        )

                } catch (error) {
                    console.trace(error)
                }
            },

            setFilter (filter) {
                Vue.set(this, 'filter', filter)
            }
        },

        computed: {
            user () {
                return this.$store.state.user
            }
        },
    }
</script>

<style lang="sass" scoped>
    section
        padding: 0.5em
        box-sizing: border-box

        & > div
            margin: 0.5em
            display: inline-block
            height: 0
            overflow: hidden
            justify-content: flex-start
            align-items: flex-start
            box-sizing: border-box
            padding-top: 20%
            position: relative
            display: inline-block
            width: 20%
            background-repeat: no-repeat
            background-size: cover
            filter: saturate(130%)

            @media (max-width: 1400px)
                width: calc(25% - 1em)
                padding-top: calc(25% - 1em)
            
            @media (max-width: 1100px)
                width: calc(33.33% - 1em)
                padding-top: calc(33.33% - 1em)
            
            @media (max-width: 900px)
                width: calc(50% - 1em)
                padding-top: calc(50% - 1em)

            @media (max-width: 600px)
                width: calc(100% - 1em)
                padding-top: calc(100% - 1em)

            .upvote
                display: inline-block
                position: absolute
                bottom: 0
                right: 0
                display: flex
                align-items: center
                color: gray
                font-size: 12px

                span
                    margin: 0.2em

                button
                    margin-left: 0.2em
                    border: none !important
                    width: 2em
                    height: 2em
                    background-color: rgb(230,230,230)
                    display: inline-block
                    background-image: url('../static/upvote.svg')
                    background-size: 55%
                    background-position: center center
                    background-repeat: no-repeat
                    filter: invert(100%)
                    cursor: pointer

                button[vote=false]
                    display: block
                    pointer-events: none
                    opacity: 0.5

            .info
                display: flex
                flex-direction: column
                justify-content: center
                align-items: center
                box-sizing: border-box
                padding: 0
                box-sizing: border-box
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                background-color: rgba(37,37,37,0.8)

            img
                margin-right: 1em
                width: auto
                min-height: 100%
            
            h1
                font-weight: 200
                font-size: 1.3em
                display: inline-block
                text-align: center

            .username
                opacity: 0.5
                font-size: 12px

            .description
                overflow: hidden
                max-height: 3em
                width: 100%
                overflow-y: auto
                box-sizing: border-box
                opacity: 0.8
                font-size: 14px
                text-align: center
                margin-top: 1em

            .url
                height: 0
                margin-top: 0.5em
                margin-bottom: -0.5em
                
                button
                    background-size: contain
                    background-repeat: no-repeat
                    padding: 1.2em
                    font-size: 14px
                    border: none !important
                    border-radius: 4px
                    opacity: 0.6
                    filter: invert(100%)

    section.filter
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        padding-top: 0

    button.filter
        margin: 0
        font-size: 1em
        padding: 1em
        background-color: rgb(25,25,25)
        border: none !important
        transition: background-color 0.1s, color 0.1s
        width: 10em
        max-width: 50vw

        &.active
            background-color: white
            color: rgb(30,30,30)
</style>