/*
    HOW RESTFUL ROUTES WORK
    Using for example a dog app 
    =======================================================
    NAME        URL         VERB    DESCRIPTION
    =======================================================
    INDEX       /dogs       GET     Display a list of all dogs
    NEW         /dogs/new   GET     Display a form to add a new dog to list
    CREATE      /dogs       POST    Add new dog to database
    SHOW        /dogs/:id   GET     Shows more info about one dog on the list 

*/

//  Import Modules
const passportLocalMongoose = require("passport-local-mongoose"),
      localStrategy         = require("passport-local"),
      bodyParser            = require('body-parser'),
      passport              = require('passport'),
      mongoose              = require('mongoose'),
      express               = require('express'),
      path                  = require('path');

//  LOCAL DEPENDENCIES
const Campground    = require('./models/campground'), 
      Comment       = require('./models/comment'),
      seedDB        = require('./seeds'),
      User          = require('./models/user');

// Setup Express App
const app = express();      // Run Express App
app.set('views', path.join(__dirname, 'views'));    // view engine setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));     //Connect to style sheet and other assets
app.use(bodyParser.urlencoded({ extended: true }));     // parse application/x-www-form-urlencoded
app.use(require('express-session')({    //express-sessions
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//User middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//Set up default mongoose connection 
var mongoDB = 'mongodb://localhost/yelpCamp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// populate with data
seedDB();

// FUNCTIONS
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
/*
*    ROUTES
*/

app.get('/', (req,res) => {
    res.render('home');
});

// INDEX - Display Campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

// CREATE - Create new campground
app.post('/campgrounds', (req, res) => {
    // Save input from form
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name: name, image: image, description: description};
    //Add new Camp ground details to database
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
           //Redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

// NEW - Display form to create new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

//SHOW - display more information on one campground
app.get('/campgrounds/:id', (req, res) => {
    //find the campground with the designated ID
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //Display the campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//  ============================
//      COMMENTS ROUTES
//  ============================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: foundCampground});
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    //  look up campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


//  ============================
//      AUTH ROUTES
//  ============================

//Show register form
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/campgrounds');
        });
    });
});

//  Show Login Form
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login" }), (req, res) => {

});

// logout route
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
// Listening Server
app.listen(8000, () => {
    console.log('Yelp Camp Server has started on http://localhost:8000');
});