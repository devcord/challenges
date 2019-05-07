<template>
    <Submissions :submissions="submissions" :canUpvote="false" />
</template>

<script>
    import Vue from 'vue'
    import Submissions from '~/components/Submissions'

    export default {
        data () {
            return {
                submissions: []
            }
        },

        components: {
            Submissions
        },

        async mounted () {
            this.$store.commit('set', {
                pageTitle: 'Archive'
            })

            const data = await this.api('submissions/'+this.$nuxt._route.params.id)


            for (const i in data.submissions)
                data.submissions[i].user = (await this.api('users/' + data.submissions[i].id)).user

            if (data.success) Vue.set(
                this, 
                'submissions', 
                data.submissions.sort(
                    (a,b) => b.date - a.date
                )
            )
        }
    }
</script>

