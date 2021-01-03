const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReAuthor } = require("../middleware");
const { postNewReview, deleteReview } = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(postNewReview));

router.delete("/:reviewId", isLoggedIn, isReAuthor, catchAsync(deleteReview));

module.exports = router;

// THIS FILE SETS THE ROUTES FOR REVIEWS -- split off index.js initially
