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
                message: 'You\'ve already submitted!'
            })
        } catch {}

        const {
            url,
            title
        } = req.body

        const error = 
              title.length > 50 ? 'Title must not be longer than 32 characters'
            : title.length <= 2 ? 'Title must be longer than 2 characters'
            : url.length > 500 ? 'URL must not be longer than 500 characters' 
            : !/^https:\/\/(github\.com\/[^\/ ]+\/[^\/ ]+|codepen\.io\/[^\/ ]+\/pen\/[^\/ ]+|jsfiddle\.net\/[^\/ ]+)\S*/.test(url) ? 'Invalid URL'
            : ''

        if (error) return res.json({
            success: false,
            message: error
        })

        main.postSync({
            id: user.id,
            url,
            title,
            upvotes: [],
            date: Date.now()
        })

        res.json({
            success: true
        })
    })

    post('/upvote/:id', async (req,res) => {
        const {user} = await refresh(req,res)
        const main = submissions.database('main')

        if (!main.existsSync()) return res.json({
            success: false,
            message: 'invalid submission'
        })

        try {
            const submission = main.getSync(req.params.id)

            if (submission.id === user.id) return res.json({
                success: false,
                message: `must not be own submission`
            })

            if (submission.upvotes.indexOf(user.id) > -1) {
                submission.upvotes.splice(submission.upvotes.indexOf(user.id), 1)

                main.putSync(req.params.id, {
                    upvotes: submission.upvotes
                })

                res.json({
                    success: true,
                    message: 'retracted upvote',
                    upvotes: submission.upvotes
                })
            } else {
                submission.upvotes.push(user.id)

                main.putSync(req.params.id, {
                    upvotes: submission.upvotes
                })

                res.json({
                    success: true,
                    message: 'upvoted',
                    upvotes: submission.upvotes
                })
            }
        } catch (error) {
            res.json({
                success: false,
                message: 'invalid submission'
            })
        } 
    })

    get('/submissions', async (req,res) => {
        const mainSubmissions = []

        const main = submissions.database('main')

        if (main.existsSync()) {
            mainSubmissions.push(...main.allSync())
        }

        res.json({
            success: true,
            submissions: mainSubmissions
        })
    })

    get('/submissions/:id', async (req,res) => {
        const mainSubmissions = []

        const main = submissions.database(req.params.id)

        if (main.existsSync()) {
            mainSubmissions.push(...main.allSync())
        }

        res.json({
            success: true,
            submissions: mainSubmissions
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
    
    get('/get-challenge/:id', async (req,res) => {
        try {
            res.json({
                success: true,
                challenge: challenge.getSync(req.params.id)
            })
        } catch {
            res.json({
                success: false,
                message: `no challenge`
            })
        }
    })

    get('/all-challenges', async (req,res) => {
        const challenges = challenge.allSync()
        
        for (const i in challenges) {
            if (challenges[i].id === 'main') challenges.splice(i,1)
        }

        res.json({
            success: true,
            challenges
        })
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
            end: Date.now() + (604800000*2), // 2 weeks
        })

        if (fs.readdirSync('./data/submissions').indexOf('main') > -1) {
            const main = submissions.database('main')

            if (oldChallenge) oldChallenge.winner = main.allSync().sort(
                (a,b) => Object.keys(b.upvotes).length - Object.keys(a.upvotes).length
            )[0]

            fs.renameSync('./data/submissions/main', './data/submissions/'+oldChallenge.id)
        }
    
        if (oldChallenge) {
            oldChallenge.id = oldChallenge.index
            challenge.postSync(oldChallenge)
        }
    
        res.json({
            length: challenges.length,
            oldIndex: oldChallenge.index,
            success: true
        })
    })
}