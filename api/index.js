const express = require('express')
const fs = require('fs')
const app = express()
const btoa = require('btoa')
const axios = require('axios');
const fetch = require('node-fetch');

try {
    fs.readdirSync('./data')
} catch {
    fs.mkdirSync('./data')
}

const db = new(require('nosqlite').Connection)('./data')
const challenge = db.database('challenge')

const getURL = (req, path) => `${req.protocol}://${req.get('host')}/${path || ''}`

if (!challenge.existsSync()) challenge.createSync()

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



app.get('/discord/auth', async (req,res) => {
    try {
        const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${
            req.query.code
        }&redirect_uri=${
            encodeURIComponent(getURL(req, 'api/discord/auth'))
        }`,
            {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)}`,
            },
        });

        res.json({
            response: await response.json()
        })
    } catch (error) {
        res.json({
            success: false,
            code: 500,
            message: 'internal server error'
        })

        console.log(error)
    }
})

app.get('/auth', async (req,res) => {
    const code = req.cookies.discord_code || false

    if (!code) return res.json({
        success: false,
        message: 'please log in'
    })

    try {
        const response = await axios.post(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${
            code
        }&redirect_uri=${
            encodeURIComponent(getURL(req, 'api/discord/auth'))
        }`, {
            headers: {
            Authorization: `Basic ${btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)}`,
            },
        })

        res.json({
            response
        })
    } catch (error) {
        console
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