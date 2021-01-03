const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
  // Path to Page with ALL CAMPS
  const camps = await Campground.find({});
  res.render("campgrounds/index", { camps });
};

module.exports.postNewCamp = async (req, res, next) => {
  const newCamp = new Campground(req.body.campground);
  newCamp.author = req.user._id;
  await newCamp.save();
  req.flash("success", "Create New Campground Successful!");
  res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.getNewCamp = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.showCamp = async (req, res, next) => {
  // PATH to show individual Camp
  const camp = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!camp) {
    req.flash("error", "This page does not exist!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { camp });
};

module.exports.showEditCamp = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp) {
    req.flash("error", "Cant edit a campground that doesn't exist!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

module.exports.postEditCamp = async (req, res, next) => {
  const camp2 = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  req.flash("success", "Edit Campground Successful!");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deleteCamp = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndDelete(id);
  req.flash("success", "Delete Campground Successful!");
  res.redirect(`/campgrounds`);
};
