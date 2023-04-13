const { default: mongoose } = require("mongoose");

const ReviewScema = mongoose.Schema({
  productID: {
    type: String,
  },
  review: {
    type: String,
  },
  userName: {
    type: String,
    required: [true, "Please Enter User Name"],
    trim: true,
  },
  userEmail: {
    type: String,
    required: [true, "Please Enter User Email"],
    trim: true,
  },
  userProfilePicture: {
    type: String,
    required: [true, "Please Enter User Profile Picture"],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

module.exports = ReviewScema;
