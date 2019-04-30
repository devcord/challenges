const express = require('express')
const fs = require('fs')
const crypt = require('./crypt')
const discord = require('./discord')

const app = express()

try {
    fs.readdirSync('./data')
} catch {
    fs.mkdirSync('./data')
}

const errors = {
    internal: {
        success: false,
        code: 500,
        message: 'internal server error'
    }
}

discord.init({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    token: process.env.BOT_TOKEN
})

const db = new(require('nosqlite').Connection)('./data')
const challenge = db.database('challenge')
const auth = db.database('auth')

const getURL = (req, path) => `${req.protocol}://${req.get('host')}/${path || ''}`

if (!challenge.existsSync()) challenge.createSync()
if (!auth.existsSync()) auth.createSync()

app.use(require('body-parser').json())
app.use(require("cookie-parser")())

app.get('/test', (req,res) => {
    res.json({
        response: 'abc'
    })
})

app.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${
        discord.credentials.id
    }&scope=identify&response_type=code&redirect_uri=${
        encodeURIComponent(getURL(req, 'api/discord/code'))
    }`)
})

app.get('/users/:id', async (req,res) => {
    try {
        const {id} = req.params
        const {access_token} = JSON.parse(req.cookies.discord_token)

        res.json({
            success: true,
            user: id === '@me' 
                ? await discord.user({ token: access_token })
                : await discord.user({ id })
        })
    } catch (error) {
        res.json(errors.internal)
        console.log(error)
    }
})

app.get('/discord/refresh', async (req,res) => {
    try {
    } catch (error) {
        res.json(errors.internal)
        console.log(error)
    }
})

app.get('/discord/code', async (req,res) => {
    try {
        const response = await discord.code({
            code: req.query.code,
            redirect_uri: encodeURIComponent(getURL(req, 'api/discord/code'))
        })

        const { access_token, refresh_token, expires_in } = response.token
        const { user } = response
    
        res.cookie('discord_token', JSON.stringify({
            access_token, expires_in
        }))

        auth.postSync({
            id: user.id,
            refresh_token: crypt.encrypt(refresh_token, access_token.padEnd(32,'0'))
        })
    
        res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        res.json(errors.internal)
    }
})

app.post('/submit', async (req,res) => {
    
})

app.post('/set-challenge', async (req,res) => {
    try {
        if (!req.body.token === process.env.DB_TOKEN) return res.json({
            code: 403,
            message: 'forbidden'
        })

        const {title,description} = req.body

        let oldChallenge;

        try {
            oldChallenge = challenge.getSync('main')
        } catch {}

        const challenges = challenge.allSync()

        challenge.postSync({
            id: 'main',
            index: challenges.length+1,
            title,
            description,
            date: Date.now(),
            end: Date.now() + 604800000 // 1 week
        })

        oldChallenge.id = oldChallenge.index

        challenge.postSync(oldChallenge)

        res.json({
            length: challenges.length,
            oldIndex: oldChallenge.index,
            success: true
        })

    } catch (error) {
        res.json({
            success: false,
            error
        })
    }
})

export default {
    path: '/api',
    handler: app
}