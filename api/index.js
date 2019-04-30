const express = require('express')
const fs = require('fs')
const btoa = require('btoa')
const fetch = require('node-fetch');
const crypt = require('./crypt')

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
        process.env.CLIENT_ID
    }&scope=identify&response_type=code&redirect_uri=${
        encodeURIComponent(getURL(req, 'api/discord/auth'))
    }`);
})

const discord = async (path, Authorization, method) => await (
    await fetch(`https://discordapp.com/api/${path}`, {
        method, headers: { Authorization },
    })
).json()

const getAvatar = data => data.avatar ? `https://cdn.discordapp.com/avatars/${
    data.id
}/${
    data.avatar
}.png` : `https://cdn.discordapp.com/embed/avatars/${
    data.discriminator % 5
}.png`

const getCurrentUserData = async token => {
    const data = await (await discord('users/@me', `Bearer ${ token }`))

    return {
        ...data,
        avatar_url: getAvatar(data)
    }
}

const getUserData = async id => {
    const data = await (await discord(`users/${id}`, `Bot ${ process.env.BOT_TOKEN }`))

    return {
        ...data,
        avatar_url: getAvatar(data)
    }
}

app.get('/users/@me', async (req,res) => {
    try {
        const {access_token} = JSON.parse(req.cookies.discord_token) 
        
        res.json({
            success: true,
            user: await getCurrentUserData(access_token)
        })
    } catch (error) {
        res.json(errors.internal)
        console.log(error)
    }
})

app.get('/users/:id', async (req,res) => {
    try {
        res.json({
            success: true,
            user: await getUserData(req.params.id)
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
        let response = await discord(`oauth2/token?grant_type=authorization_code&code=${
            req.query.code
        }&redirect_uri=${
            encodeURIComponent(getURL(req, 'api/discord/auth'))
        }`,`Basic ${
            btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)
        }`, 'POST');

        const { access_token, expires_in, refresh_token } = response

        res.cookie('discord_token', JSON.stringify({
            access_token,expires_in
        }))

        const user = await getCurrentUserData(access_token)

        res.json({
            success: true,
            user
        })

        auth.postSync({
            id: user.id,
            refresh_token: crypt.encrypt(refresh_token, access_token)
        })
    } catch (error) {
        res.json(errors.internal)
        console.log(error)
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