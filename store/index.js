export const state = () => ({
    user: {},
    challenge: {}
})

export const mutations = {
    set (state, payload) {
        Object.assign(state, payload)
    }
}

export const actions = {
    nuxtServerInit ({ commit }, { req }) {
        return commit('set', {
            host: `${req.protocol}://${req.headers.host}`
        })
    }
}