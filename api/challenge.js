module.exports = ({
    post,
    db,
    refresh
}) => {
    const challenge = db.database('challenge')

    if (!challenge.existsSync()) challenge.createSync()

    post('/submit', async (req,res) => {
        
    })
    
    post('/set-challenge', async (req,res) => {
        const {user} = await refresh(req,res)
    
        if (process.env.ADMIN_ID.indexOf(user.id) < 0) return res.json(
            errors.unauthorized
        )

        const { 
            title, 
            description
        } = req.body
    
        let oldChallenge;
    
        try { oldChallenge = challenge.getSync('main') } catch {}
    
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
    })
}