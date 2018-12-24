const express = require("express"),
      router  = express.Router({ mergeParams: true }),
      verifyUser = require("../verifyUser"),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment");

//  Show Comments Create Page
router.get('/new', verifyUser, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: foundCampground});
        }
    });
});

// Create Comments
router.post('/', verifyUser, (req, res) => {
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

module.exports = router;