//  Import Modules
const passportLocalMongoose = require("passport-local-mongoose"),
      localStrategy         = require("passport-local"),
      bodyParser            = require('body-parser'),
      passport              = require('passport'),
      mongoose              = require('mongoose'),
      express               = require('express'),
      path                  = require('path'),
      app                   = express();

//  LOCAL DEPENDENCIES
const Campground    = require('./models/campground'), 
      Comment       = require('./models/comment'),
      seedDB        = require('./seeds'),
      User          = require('./models/user');

//  ROUTES
const campgrounds = require("./routes/campgrounds"),
      comments    = require("./routes/comments"),
      index       = require("./routes/index");

// Setup Express App
app.set('views', path.join(__dirname, 'views'));  // view engine setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));  // Connect to assets
app.use(bodyParser.urlencoded({ extended: true }));  // parse application/x-www-form-urlencoded
app.use(require('express-session')({    // express-sessions
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//User middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// Connect to Routes
app.use(index);
app.use("/campgrounds/:id/comments", comments);
app.use("/campgrounds", campgrounds);

// passport config
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Set up default mongoose connection 
var mongoDB = 'mongodb://localhost/yelpCamp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// populate with data
seedDB();

// Listening Server
app.listen(8000, () => {
    console.log('Yelp Camp Server has started on http://localhost:8000');
});