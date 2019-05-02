const express = require('express')
const fs = require('fs')
const app = express()

app.use(require('body-parser').json())
app.use(require("cookie-parser")())

try {
    fs.readdirSync('./data')
} catch {
    fs.mkdirSync('./data')
}

const db = new(require('nosqlite').Connection)('./data')

const errors = {
    internal: {
        success: false,
        code: 500,
        message: 'internal server error'
    },

    unauthorized: {
        success: false,
        code: 401,
        message: 'unauthorized'
    }
}

const getURL = (req, path) => `${req.protocol}://${req.get('host')}/${path || ''}`

const get = (path, func) => {
    app.get(path, async (req,res) => {
        try {
            await func(req,res)
        } catch (error) {
            res.json(errors.internal)
            console.log(error)
        }
    })
}

const post = (path, func) => {
    app.post(path, async (req,res) => {
        try {
            await func(req,res)
        } catch (error) {
            res.json(errors.internal)
            console.log(error)
        }
    })
}

module.exports = {
    path: '/api',
    handler: app,
    
    app,
    getURL,
    get,
    post,
    db,
    errors,
    fs
}

Object.assign(
    module.exports,
    require('./auth')(module.exports)
)

require('./challenge')(module.exports)