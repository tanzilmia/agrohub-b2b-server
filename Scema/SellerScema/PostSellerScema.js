const { default: mongoose } = require("mongoose");

const postSellerScema = mongoose.Schema({
  sellerName: String,
  sellerEmail: String,
  sellerPhone: Number,
  sellerProfilePicture: String,
  name: String,
  image: String,
  oldPrice: Number,
  newPrice: Number,
  size: Array,
  stock: Number,
  description: String,
  role: String,
  additionalInfo: Array,
});

module.exports = postSellerScema;
