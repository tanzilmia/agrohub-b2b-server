const { default: mongoose } = require("mongoose");

const postSellerScema = mongoose.Schema({
  sellerName: {
    type: String,
    required: [true, "Please Enter Seller Name"],
    trim: true,
  },
  sellerEmail: {
    type: String,
    required: [true, "Please Enter Seller Email"],
    trim: true,
  },
  sellerPhone: {
    type: String,
    required: [true, "Please Enter Seller Phone"],
    trim: true,
  },
  sellerProfilePicture: {
    type: String,
    required: [true, "Please Enter Seller Profile Picture"],
    trim: true,
  },
  name: {
    type: String,
  },
  images: {
    type: Array,
    required: [true, "please Enter Product Images"],
  },
  oldPrice: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "Price Cannot Exceed 8 Characters"],
  },
  newPrice: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "Price Cannot Exceed 8 Characters"],
  },
  size: {
    type: Array,
    required: [true, "Please Enter Product Size"],
  },
  stock: {
    type: String,
    required: [true, "Please Enter Product Stock"],
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },
  role: {
    type: String,
    required: [true, "please Enter Seller Role"],
  },
  additionalInfo: {
    type: Array,
    required: [true, "please Enter Additional Information"],
  },
  totalSells: {
    type: Number,
  },
  totalQuantity: {
    type: Number,
  },
  category: {
    type: String,
    required: [true, "please Enter Product Category"],
  },
  brand: {
    type: String,
    required: [true, "please Enter Product Brand"],
  },
});

module.exports = postSellerScema;
