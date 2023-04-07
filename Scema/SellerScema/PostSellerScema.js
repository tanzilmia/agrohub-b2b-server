const { default: mongoose } = require("mongoose");

const postSellerScema = mongoose.Schema({
  sellerName: String,
  sellerEmail: String,
  sellerPhone: String,
  sellerProfilePicture: String,
  name: String,
  image: String,
  oldPrice: String,
  newPrice: String,
  size: Array,
  stock: String,
  description: String,
  role: String,
  additionalInfo: Array,
});

module.exports = postSellerScema;
