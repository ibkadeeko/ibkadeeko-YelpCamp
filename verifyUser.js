function verifyUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/register');
}

module.exports = verifyUser;