const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground"),
      verifyUser = require("../verifyUser");

      
// INDEX - Display Campgrounds
router.get('/', verifyUser, (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

// CREATE - Create new campground
router.post('/', verifyUser, (req, res) => {
    //Add new Camp ground details to database
    Campground.create(req.body.campground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
           //Redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

// NEW - Display form to create new campground
router.get('/new', verifyUser, (req, res) => {
    res.render('campgrounds/new');
});

//SHOW - display more information on one campground
router.get('/:id', verifyUser, (req, res) => {
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

module.exports = router;