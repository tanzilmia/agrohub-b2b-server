const mongoose = require("mongoose");
const CartProductSchema = mongoose.Schema({
  Email: {
    type: String,
    trim: true,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productCount: {
    type: Number,
  },
  countPrice: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("CartProduct", CartProductSchema);
