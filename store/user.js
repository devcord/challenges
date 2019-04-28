export const state = () => ({
    username: '',
    avatar: '',
})

export const mutations = {
    set (state, payload) {
        Object.assign(state, payload)
    }
}