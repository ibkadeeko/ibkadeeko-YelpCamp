const passport = require('passport'),
      express = require('express'),
      User = require('../models/user'),
      router = express.Router(),
      verifyUser = require("../verifyUser");

//  Root Route
router.get('/', (req,res) => {
    res.render('home');
});

//Show register form
router.get('/register', (req, res) => {
    res.render('register');
});

//  Register form Logic
router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

//  Show Login Form
router.get('/login', (req, res) => {
    res.render('login');
});

//  Login Form Logic
router.post('/login', passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login" }), (req, res) => {

});

// logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


module.exports = router;