const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
} = require("../controllers/users");

router.route("/register").get(getRegister).post(catchAsync(postRegister));

router
  .route("/login")
  .get(getLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(postLogin)
  );

router.get("/logout", getLogout);

module.exports = router;
