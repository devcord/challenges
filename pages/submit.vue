<template>
    <section>
        <div>
            <h1><span style="opacity:0.6;">Challenge:</span> <nuxt-link to="/">{{challenge.title}}</nuxt-link></h1>
            <input 
                placeholder="Title" 
                @blur="e => errorCheck('title')" 
                :class="`${errors.title ? 'error' : ''} ${!user.id ? 'disabled' : ''}`"
                v-model="inputs.title"
            />
            <p class="error" v-show="errors.title.length > 0">{{errors.title}}</p>
            <input 
                spellcheck="false"
                placeholder="URL" 
                @blur="e => errorCheck('url')" 
                :class="`${errors.url ? 'error' : ''} ${!user.id ? 'disabled' : ''}`"
                v-model="inputs.url"
            />
            <p class="error" v-show="errors.url.length > 0">{{errors.url}}</p>
            <p :class="`${!user.id ? 'disabled' : ''}`">
                *Must be a <a 
                    href="https://github.com/" 
                    target="_blank"
                >GitHub</a>, <a 
                    href="https://codepen.io/" 
                    target="_blank"
                >CodePen</a>, or <a 
                    href="https://jsfiddle.net/" 
                    target="_blank"
                >JSFiddle</a> link.
            </p>
            <!-- <textarea 
                placeholder="Brief description of your project, not required" 
                @blur="e => errorCheck('description')" 
                :class="errors.description ? 'error' : ''"
                v-model="inputs.description"
            /> -->
            <!-- <p class="error" v-show="errors.description.length > 0">{{errors.description}}</p> -->
            <p class="error" v-show="errors.internal.length > 0">{{errors.internal}}</p>
            <button :class="`submit${!user.id ? ' disabled' : ''}`" @click="submit()">Submit</button>
            <p class="please-log-in" v-show="!user.id">Please <a href="/api/login">log in</a> to submit.</p>
        </div>
    </section>
</template>

<style lang="sass" scoped>
    section
        margin: auto
        height: calc(100vh - 6em)
        padding-bottom: 6em
        box-sizing: border-box
        overflow: hidden
        overflow-y: auto

        div
            display: flex
            flex-direction: column
            width: 90vw
            max-width: 600px
            justify-content: center
            align-items: flex-start
            margin: auto
            padding: 2em 0
            box-sizing: border-box
            min-height: 100%

        input,textarea
            font-size: 1em
            width: 100%
            height: 3em
            color: rgb(230,230,230)
            padding: 1em
            box-sizing: border-box
            margin-top: 0.5em
            resize: vertical
            background: rgb(25,25,25)
            border-top: 2px solid rgb(25,25,25)
            border-bottom: 2px solid rgb(25,25,25)

            &.error
                border-bottom: 2px solid #ff3357

        .error
            color: #ff3357

        p.error
            font-size: 12px

        textarea
            height: 12em
            min-height: 5em
            

        .submit
            margin: 1em auto 0
            font-size: 1em
            padding: 1em
            background-color: rgb(25,25,25)
            border: none !important
            transition: background-color 0.1s, color 0.1s
            border-radius: 4px
            display: block

            &:hover
                background-color: white
                color: rgb(30,30,30)
        
        h1
            width: 100%
            text-align: center
            font-weight: 200
            margin-bottom: 0.5em

            a
                color: white
                text-decoration: none

                &:hover
                    color: #90CAF9

        a
            color: #90CAF9

        p
            margin-top: 10px
            margin-bottom: 15px
            opacity: 0.7

        .please-log-in
            margin: 2em 0 0 0
            text-align: center
            width: 100%
            height: 0

    .disabled
        pointer-events: none
        opacity: 0.4
        user-select: none
</style>

<script>
    import Vue from 'vue'

    export default {
        data () {
            return {
                errors: {
                    title: '',
                    url: '',
                    description: '',
                    internal: '',
                },

                inputs: {
                    title: '',
                    url: '',
                    // description: ''
                }
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

        methods: {
            errorCheck (name) {
                const {title, url} = this.inputs

                switch (name) {
                    case 'title':
                        this.errors.title = 
                              title.length > 50 ? 'Title must not be longer than 32 characters'
                            : title.length <= 2 ? 'Title must be longer than 3 characters'
                            : ''
                    break
                    case 'url':
                        this.errors.url = 
                              url.length > 500 ? 'URL must not be longer than 500 characters' 
                            : !/^https:\/\/(github\.com\/[^\/ ]+\/[^\/ ]+|codepen\.io\/[^\/ ]+\/pen\/[^\/ ]+|jsfiddle\.net\/[^\/ ]+)\S*/.test(url) ? 'Invalid URL'
                            : ''
                    break
                    // case 'description':
                    //     this.errors.description = 
                    //           description.length > 500 ? 'Description must not be longer than 500 characters'
                    //         : ''
                    // break
                }
            },

            async submit () {
                const {title, url} = this.inputs

                for (const i of Object.keys(this.inputs)) {
                    this.errorCheck(i)
                }

                if (Object.values(this.errors).join('').length > 0) return

                const data = await this.api('submit', {
                    method: 'post',
                    data: {
                        title,
                        url
                    }
                })

                if (data.success) this.$router.push('/vote')
                else Vue.set(this.errors, 'internal', data.message) 
            }
        },

        mounted () {
            this.$store.commit('set', {
                pageTitle: 'Submit'
            })
        }
    }
</script>
