const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middleware = {
  verifyUser: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/register');
  },

  verifyUserAuthorization: (req, res, next) => {
    // Is user logged in?
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
          res.redirect('/campgrounds');
        } else {
          // Does User own the campground
          if (foundCampground.author.id.equals(req.user._id)) {
            return next();
          }
          res.redirect('back');
        }
      });
    } else {
      res.redirect('back');
    }
  },

  checkCommentOwnership: (req, res, next) => {
    // Is user logged in?
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          res.redirect('/campgrounds');
        } else {
          // Does User own the campground
          if (foundComment.author.id.equals(req.user._id)) {
            return next();
          }
          res.redirect('back');
        }
      });
    } else {
      res.redirect('back');
    }
  },
};


module.exports = middleware;
