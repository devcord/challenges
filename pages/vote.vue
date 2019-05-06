<template>
    <section>
        <Submissions :submissions="submissions" :canUpvote="true"/>
    </section>
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
            const data = await this.api('submissions')

            for (const i in data.submissions) {
                data.submissions[i].user = (await this.api('users/' + data.submissions[i].id)).user
            }

            if (data.success) 
                Vue.set(
                    this, 
                    'submissions', 
                    data.submissions.sort(
                        (a,b) => b.date - a.date
                    )
                )
        }
    }
</script>
