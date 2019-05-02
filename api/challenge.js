module.exports = ({
    get,
    post,
    fs,
    db,
    refresh,
    errors
}) => {
    const challenge = db.database('challenge')
    const submissions = new(require('nosqlite').Connection)('./data/submissions')

    if (!challenge.existsSync()) challenge.createSync()

    post('/submit', async (req,res) => {
        const {user} = await refresh(req,res)

        const main = submissions.database('main')
        if (!main.existsSync()) main.createSync()

        try {
            if (main.getSync(user.id)) return res.json({
                success: false,
                message: 'already submitted'
            })
        } catch {}

        const {
            url,
            title,
            description
        } = req.body

        const error = 
              title.length > 50 ? 'Title must not be longer than 32 characters'
            : title.length <= 2 ? 'Title must be longer than 2 characters'
            : url.length > 500 ? 'URL must not be longer than 500 characters' 
            : !/^https:\/\/(github\.com\/[^\/ ]+\/[^\/ ]+|codepen\.io\/[^\/ ]+\/pen\/[^\/ ]+|jsfiddle\.net\/[^\/ ]+)\S*/.test(url) ? 'Invalid URL'
            : description.length > 500 ? 'Description must not be longer than 500 characters'
            : ''

        if (error) return res.json({
            success: false,
            message: error
        })

        main.postSync({
            id: user.id,
            url,
            title,
            description
        })

        res.json({
            success: true
        })
    })
    
    get('/get-challenge', async (req,res) => {
        try {
            res.json({
                success: true,
                challenge: challenge.getSync('main')
            })
        } catch {
            res.json({
                success: false,
                message: `no challenge`
            })
        }
    })

    post('/set-challenge', async (req,res) => {
        const {user} = await refresh(req,res)

        if (process.env.ADMIN_ID.split(',').indexOf(user.id) < 0) return res.json(
            errors.unauthorized
        )

        const { 
            title, 
            description,
            rules
        } = req.body
    
        console.log(
            title,
            description
        )

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
            rules,
            date: Date.now(),
            end: Date.now() + 604800000, // 1 week
        })
    
        if (oldChallenge) {
            oldChallenge.id = oldChallenge.index
            challenge.postSync(oldChallenge)
        }

        if (fs.readdirSync('./data/submissions').indexOf('main') > -1) {
            fs.renameSync('./data/submissions/main', './data/submissions/'+oldChallenge.id)
        }
    
        res.json({
            length: challenges.length,
            oldIndex: oldChallenge.index,
            success: true
        })
    })
}