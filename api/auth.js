const crypt = require('./crypt')
const discord = require('./discord')

module.exports = ({
    getURL,
    get,
    db,
    errors
}) => {
    discord.init({
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
        token: process.env.BOT_TOKEN
    })

    const auth = db.database('auth')
    if (!auth.existsSync()) auth.createSync()

    const setToken = (res, response) => {
        const { access_token, refresh_token, expires_in } = response.token
        const { user } = response

        console.log('encrypt: '+access_token.padEnd(32,'0'))

        auth.postSync({
            id: user.id,
            refresh_token: crypt.encrypt(refresh_token, access_token.padEnd(32,'0'))
        })

        res.cookie('discord_token', JSON.stringify({
            access_token, expires_at: expires_in + Date.now(), id: user.id
        }), {
            httpOnly: true
        })
    } 

    const refresh = async (req,res) => {
        if (!req.cookies.discord_token) return errors.unauthorized

        const old_token = JSON.parse(req.cookies.discord_token)

        console.log('decrypt: '+old_token.access_token.padEnd(32,'0'))

        const response = await discord.refresh({
            refresh_token: crypt.decrypt(
                auth.getSync( old_token.id ).refresh_token,
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

    get('/login', (req, res) => {
        res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${
            discord.credentials.id
        }&scope=identify&response_type=code&redirect_uri=${
            encodeURIComponent(getURL(req, 'api/discord/code'))
        }`)
    })

    get('/logout', (req, res) => {
        if (!req.cookies.discord_token) return res.redirect(getURL(req))
        auth.deleteSync(JSON.parse(req.cookies.discord_token).id)
        res.clearCookie('discord_token')
        res.redirect(getURL(req))
    })

    get('/discord/refresh', async (req,res) => {
        await refresh(req,res)
        res.json({
            success: true
        })
    })

    get('/discord/code', async (req,res) => {
        const response = await discord.code({
            code: req.query.code,
            redirect_uri: encodeURIComponent(getURL(req, 'api/discord/code'))
        })

        setToken(res, response)
        res.redirect(getURL(req))
    })

    get('/users/:id', async (req,res) => {
        const {id} = req.params

        if (id === '@me') {
            const data = (await refresh(req,res))

            if (!data.success) return res.json(data)

            res.json({
                success: true,
                user: data.user
            })
        } else {
            res.json({
                success: true,
                user: await discord.user({ id })
            })
        }
    })

    return { refresh }
}