const mongoose = require("mongoose");
const Schema = mongoose.Schema; //  shortening up mongoose.Schema for later

const reviewSchema = Schema({
  // using shortened Schema here
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
