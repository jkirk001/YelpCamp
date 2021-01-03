if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express"); // allows us to use express
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const path = require("path"); //allows us to use path methods
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//New way to test if mongoose connects instead of using .then() and .catch() on above method

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("OMG DB connected!");
});

const app = express(); // sets app to be usable express OBJECT
app.engine("ejs", ejsMate);

app.set("view engine", "ejs"); // allows us to use ejs to template
app.set("views", path.join(__dirname, "views")); // sets main path to views folder

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "BadSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 604800000, // expires one week from today
    maxAge: 604800000,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//PATHS     PATHS      PATHS

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);
app.get("/", (req, res) => {
  res.render("home");
});

// -------------------------------------------------------Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "404: THis page does not exist"));
});
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) error.message = "default error";
  res.status(status).render("error", { err });
});

app.listen(3000, (req, res) => {
  console.log("listening on port 3000!");
});
