import Vue from 'vue'

Vue.mixin({
    created () {
        this.api = async (url, options) => {
            return (await this.$axios({
                url: `${this.$store.state.host}/api/${url}`,
                ...options
            })).data
        }
    }
})