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

// Import Modules
const express       = require('express'),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose');

// Setup Express App
const app = express();      // Run Express App
app.set('view engine', 'ejs');      //Connect to ejs
app.use(express.static('public'));      //Connect to style sheet and other assets
app.use(bodyParser.urlencoded({ extended: true }));     // parse application/x-www-form-urlencoded

//Set up default mongoose connection 
var mongoDB = 'mongodb://localhost/yelpCamp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// MongoDB Schema SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
const Campground = mongoose.model("Campground", campgroundSchema);

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
            res.render('index', {campgrounds: campgrounds});
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
    res.render('new');
});

//SHOW - display more information on one campground
app.get('/campgrounds/:id', (req, res) => {
    //find the campground with the designated ID
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //Display the campground
            // console.log(foundCampground);
            res.render('show', {campground: foundCampground});
        }
    });
});

// Listening Server
app.listen(8181, () => {
    console.log('Yelp Camp Server has started on http://localhost:8181');
});