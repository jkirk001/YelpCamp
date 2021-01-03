const { campgroundSchema, reviewSchema } = require("./joiSchemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Must log in to post no Camp");
    return res.redirect("/login");
  }
  next();
};

//---------CAMP routes middleware

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "Must be logged in as author!");
    return res.redirect(`/campgrounds/${req.params.id}`);
  }
  next();
};

//--------- Review Middleware
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isReAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You must own this review to delete it! Please Login!");
    return res.redirect(`/login`);
  }
  next();
};
