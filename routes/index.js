const passport = require('passport');
const express = require('express');
const User = require('../models/user');

const router = express.Router();


//  Root Route
router.get('/', (req, res) => {
  res.render('home');
});

// Show register form
router.get('/register', (req, res) => {
  res.render('login');
});

//  Register form Logic
router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('login');
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
});

//  Show Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

//  Login Form Logic
router.post('/login', passport.authenticate('local', { successRedirect: '/campgrounds', failureRedirect: '/login' }), (req, res) => {

});

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
