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

const setToken = (res, response) => {
    const { access_token, refresh_token, expires_in } = response.token
    const { user } = response

    res.cookie('discord_token', JSON.stringify({
        access_token, expires_at: expires_in + Date.now(), id: user.id
    }), {
        httpOnly: true
    })

    auth.postSync({
        id: user.id,
        refresh_token: crypt.encrypt(refresh_token, access_token.padEnd(32,'0'))
    })
} 

const refresh = async (req,res) => {
    const old_token = JSON.parse(req.cookies.discord_token)

    const response = await discord.refresh({
        refresh_token: crypt.decrypt(
            auth.getSync(
                old_token.id
            ).refresh_token,
            
            old_token.access_token.padEnd(32,'0')
        ),

        redirect_uri: encodeURIComponent(getURL(req, 'api/discord/refresh'))
    })
    
    setToken(res, response)

    return {
        token: response.token,
        user: response.user,
        success: true
    }
}

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

        if (id === '@me') {
            res.json({
                success: true,
                user: (await refresh(req,res)).user
            })
        } else {
            res.json({
                success: true,
                user: await discord.user({ id })
            })
        }
    } catch (error) {
        res.json(errors.internal)
        console.log(error)
    }
})

app.get('/discord/refresh', async (req,res) => {
    try {
        await refresh(req,res)
        res.json({
            success: true
        })
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

        setToken(res, response)
    
        res.redirect(getURL(req))
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