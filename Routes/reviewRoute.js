const express = require("express");
const ReviewRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ReviewScema = require("../Scema/ReviewScema/ReviewScema");
const { default: mongoose } = require("mongoose");
const Review = new mongoose.model("Review", ReviewScema);

ReviewRoute.use(express.json());

// test route
ReviewRoute.get("/", (req, res) => {
  res.send("ReviewRoute");
});

// get review data
ReviewRoute.get("/user_review", async (req, res) => {
  try {
    const reviews = await Review.find({}).lean();
    res.send(reviews);
  } catch (error) {
    console.log(error);
    res.json({
      error: "An error occurred while retrieving the reviews",
    });
  }
});

// get multiple riview
ReviewRoute.get("/multiple_review/:id", async (req, res) => {
  try {
    const review = await Review.find({ productID: req.params.id });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete a review
ReviewRoute.delete("/delete_review/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error deleting review");
  }
});

// post a review
ReviewRoute.post("/product_review", async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    if (newReview) {
      res.send(newReview);
    } else {
      res.json({
        error: "THIS WAS A SERVER ERROR",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// send front end to database rating
ReviewRoute.post("/product_rating/:id/rating", async (req, res) => {
  const id = req.params.id;
  const { rating } = req.body;
  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );
    if (!review) {
      return res.json({ message: "Review not found" });
    }
    res.json({ message: "Rating saved", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = ReviewRoute;
