module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Cache-Control, Content-Type, Authorization, Content-Length, X-Requested-With')
    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
}
