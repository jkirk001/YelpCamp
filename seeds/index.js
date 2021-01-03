//ONLY USED TO MAKE SEENDS FOR DATABASE!
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//New way to test if mongoose connects instead of using .then() and .catch() on above method

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("OMG DB connected!");
});

// function that returns random location in ARRAY
const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// function that creates DB seeds
const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000) + 1;
    const price = Math.floor(Math.random() * 100);
    const camp = new Campground({
      author: "5fee45c65856ce0aff87d3bb",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. A repudiandae autem mollitia numquam sequi provident sint. Sed perspiciatis facilis voluptatem voluptates dolore. Quia dolorum, perspiciatis dolorem sed ex fuga laudantium?",
      price: `${price}`,
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
