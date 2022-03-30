
module.exports = function (req,res,next) {
    if (!req.user.isAuthor) return res.status(403).send('Access denied')
    next()
}