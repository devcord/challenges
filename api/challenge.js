module.exports = ({
    get,
    post,
    db,
    refresh,
    errors
}) => {
    const challenge = db.database('challenge')

    if (!challenge.existsSync()) challenge.createSync()

    post('/submit', async (req,res) => {
        const {user} = await refresh(req,res)
        const challenge = challenge.getSync('main')

        if (challenge.submissions[user.id]) {}
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
            submissions: {}
        })
    
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