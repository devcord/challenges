<template>
    <section>
        <img src="@/static/iconSquare.png"/> <span v-show="!hideText">Devcord</span>
    </section>
</template>

<style lang="sass" scoped>
    section
        display: flex
        align-items: center
        justify-content: left
        font-size: 3em
        height: 2em
        img
            width: 1.6em
</style>

<script>
    export default {
        props: ['hideText']
    }
</script>
