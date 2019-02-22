const express = require('express');

const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX - Display Campgrounds
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// CREATE - Create new campground
router.post('/', middleware.verifyUser, (req, res) => {
  const newCampground = req.body.campground;
  newCampground.author = {
    id: req.user.id,
    username: req.user.username,
  };
  // Add new Camp ground details to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

// NEW - Display form to create new campground
router.get('/new', middleware.verifyUser, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW - display more information on one campground
router.get('/:id', (req, res) => {
  // find the campground with the designated ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // Display the campground
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// EDIT  - Display form to edit campground
router.get('/:id/edit', middleware.verifyUserAuthorization, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE - Update form
router.put('/:id', middleware.verifyUserAuthorization, (req, res) => {
  // Find correct campground and update it
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, foundCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      // Redirect somewhere(usually the show page)
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// DELETE
router.delete('/:id', middleware.verifyUserAuthorization, (req, res) => {
  // Find correct Campground in database and delete
  Campground.findByIdAndRemove(req.params.id, (err, foundCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      // Redirect somewhere
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
