const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');


const router = express.Router({ mergeParams: true });

//  Show Comments Create Page
router.get('/new', middleware.verifyUser, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

// Create Comments
router.post('/', middleware.verifyUser, (req, res) => {
  //  look up campground using id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // log and save author name and id from global req.user
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          // Add comment from form to the just created database entry
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

/*
    campgrounds/:id/edit
    endpoint for edit route will be campgrounds/:id/comments/:comment_id/edit
*/

//  EDIT route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
      res.render('comments/edit', { comment, campground: foundCampground });
    });
  });
});

//  UPDATE route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, newComment) => {
    res.redirect(`/campgrounds/${req.params.id}`);
  });
});

//  DELETE route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  // find comment and delete
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      // redirect to campground page
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
  // Comment.findById(req.params.comment_id, (err, foundComment) => {
  //     if (err) {
  //         console.log(err);
  //     } else {
  //         res.send(`${foundComment}`);
  //     }
  // });
});


module.exports = router;
