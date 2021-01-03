const mongoose = require("mongoose");
const Schema = mongoose.Schema; //  shortening up mongoose.Schema for later
const Review = require("./review");

const campgroundSchema = Schema({
  // using shortened Schema here
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (item) {
  //console.log('DELETED!'); //Started with this to check if 'DELETED!' prints on console when item deleted
  //console.log(item);        // Lets me see what is passed into function POST delete -- I get the object
  if (item) {
    await Review.deleteMany({ _id: { $in: item.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
