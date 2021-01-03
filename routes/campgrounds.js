const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const {
  index,
  getNewCamp,
  postNewCamp,
  showCamp,
  showEditCamp,
  postEditCamp,
  deleteCamp,
} = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(index))
  //.post(validateCampground, isLoggedIn, catchAsync(postNewCamp));
  .post(upload.array("campground[image]"), (req, res) => {
    console.log(req.files, req.body);
    return res.send("it worked!");
  });

router.get("/new", isLoggedIn, getNewCamp);

router
  .route("/:id")
  .get(catchAsync(showCamp))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(postEditCamp))
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCamp));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(showEditCamp));

module.exports = router;

// THIS FILE SETS CAMPGROUND ROUTES -- Originally in index.js
