const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.postNewReview = async (req, res, next) => {
  let camp = await Campground.findById(req.params.id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Review Posted Succesfully!");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  // IMPORTANT ----------------------------This allows us to pull the review ID from reviews Array!
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Succesfully!");
  res.redirect(`/campgrounds/${id}`);
};
