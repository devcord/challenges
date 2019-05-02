<template>
    <section>
        <div>
            <h1>{{challenge.title}}</h1>
            <input placeholder="Your project's title" class="error"/>
            <p class="error">This field is required.</p>
            <input placeholder="Link to your project" />
            <p>
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
            <textarea placeholder="Brief description of your project, not required" />
            <button class="submit">Submit</button>
        </div>
    </section>
</template>

<style lang="sass" scoped>
    section
        margin: auto
        height: calc(100vh - 6em)
        padding-bottom: 4em
        box-sizing: border-box
        overflow: hidden
        overflow-y: auto

        div
            display: flex
            flex-direction: column
            width: 90vw
            max-width: 600px
            justify-content: center
            margin: auto
            padding: 2em 0


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
                border-bottom: 2px solid #FF1744

        .error
            color: #FF1744

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
            color: #90CAF9

        p
            margin-top: 10px
            margin-bottom: 15px
            opacity: 0.7
</style>

<script>
    export default {
        computed: {
            user () {
                return this.$store.state.user
            },

            challenge () {
                return this.$store.state.challenge
            }
        },
    }
</script>
