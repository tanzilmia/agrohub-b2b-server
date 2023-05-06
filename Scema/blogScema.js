const mongoose = require("mongoose");
const blogScema = new mongoose.Schema({
  thumbnail: String,
  blogTitle: String,
  blogDetails: String,
  author: String,
  authorEmail: String,
  date: String,
});

const Blog = new mongoose.model("Blog", blogScema)
module.exports = Blog
