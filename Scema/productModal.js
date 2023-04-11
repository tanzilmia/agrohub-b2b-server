const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  sellerName: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  sellerEmail: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  sellerProfilePicture: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  name: {
    type: String,
  },

  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },

  oldPrice: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "price cannot exceed 8 characters"],
  },
  newPrice: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "price cannot exceed 8 characters"],
  },
  size: {
    type: Array,
    required: [true, "Please Enter product Price"],
  },
  stock: {
    type: String,
    required: [true, "Please Enter product Price"],
  },


  category: {
    type: String,
    required: [true, "please Enter Your Brand Name"],
    
  },
  size: [
    {
      type: Array,
      required: [true, "please Enter Your product size"],
    },
  ],

  brand: {
    type:String,
    required: [true, "please Enter Your Brand Name"],
  },
  
  rating: {
    type: Number,
    default: 0,
  },
  image: {
    type:Array,
    required: [true, "please Enter Your Brand Name"],
  },
  role: {
    type:String,
    required: [true, "please Enter Your Brand Name"],
  },
  additionalInfo: {
    type:Array,
    required: [true, "please Enter Your Brand Name"],
  },




});

module.exports = mongoose.model("product", productSchema);
