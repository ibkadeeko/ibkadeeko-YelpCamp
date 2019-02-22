//  Import Modules
const methodOverride = require('method-override');
const localStrategy = require('passport-local');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const open = require('open');

const app = express();

//  LOCAL DEPENDENCIES
const seedDB = require('./seeds');
const User = require('./models/user');

//  ROUTES
const campgrounds = require('./routes/campgrounds');
const comments = require('./routes/comments');
const index = require('./routes/index');

// Setup Express App
app.set('views', path.join(__dirname, 'views')); // view engine setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); // Connect to assets
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE
app.use(require('express-session')({ // express-sessions
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


// User middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Connect to Routes
app.use(index);
app.use('/campgrounds/:id/comments', comments);
app.use('/campgrounds', campgrounds);

// passport config
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Set up default mongoose connection
const mongoDB = 'mongodb://localhost/yelpCamp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// populate with data
// seedDB();

// Listening Server
// const port = 8000;
// app.listen(port, err => {
//     if (err) {
//         console.log(err);
//     } else {
//         open('http://localhost:' + port);
//     }
// });
app.listen(8000, () => {
  console.log('Yelp Camp Server has started on http://localhost:8000');
});
