const User = require("../models/user");

module.exports.getRegister = (req, res) => {
  res.render("users/register");
};

module.exports.postRegister = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
    });
    req.flash("success", "Welcome to YelpCamP!");
    res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", "At least one of those fields has been used before!");
    res.redirect("/register");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("users/login");
};

module.exports.postLogin = async (req, res) => {
  const returnTo = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  req.flash("success", "Welcome Back!");
  res.redirect(returnTo);
};

module.exports.getLogout = (req, res) => {
  req.logout();
  req.flash("success", "Succesfully Logged Out!");
  res.redirect("/campgrounds");
};
