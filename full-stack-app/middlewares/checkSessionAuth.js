async function checkSessionAuth(req,res,next){
    if(!req.session.user){
        req.flash("danger","You need to login first")
        return res.redirect('/login')
    }
    next();
}

module.exports = checkSessionAuth;