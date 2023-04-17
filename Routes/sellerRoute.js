const express = require("express");
const SellerRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const product = require("../Scema/SellerScema/PostSellerScema");
const { default: mongoose } = require("mongoose");
const SellerProduct = new mongoose.model("SellerProduct", product);

SellerRoute.use(express.json());
const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(403).send({ message: "UnAuthrize Access" });
    }
    if (authorization) {
      const token = authorization.split(" ")[1];
      const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`);
      const { email } = decoded;
      if (email === req.query.email) {
        next();
      } else {
        return res.status(403).send({ message: "UnAuthrize" });
      }
    }
  } catch (err) {
    return next("Privet Api");
  }
};

// test route
SellerRoute.get("/", (req, res) => {
  res.send("SellerRoute");
});

// get limit 4 product
SellerRoute.get("/limit_Product", async (req, res) => {
  try {
    const data = await SellerProduct.find({}).limit(8).lean();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the products",
    });
  }
});

// get all product
SellerRoute.get("/all_Product", async (req, res) => {
  try {
    const data = await SellerProduct.find({}).lean();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the products",
    });
  }
});

// get one id product
SellerRoute.get("/all_Product/:id", async (req, res) => {
  try {
    const data = await SellerProduct.findById(req.params.id).lean();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the product",
    });
  }
});

SellerRoute.delete("/all_Product/:id", async (req, res) => {
  try {
    const deletedProduct = await SellerProduct.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.json({ error: "An error occurred while deleting the product" });
  }
});

// post a product
SellerRoute.post("/product", verifyToken, async (req, res) => {
  try {
    const alreadyExists = await SellerProduct.findOne({ name: req.body.name });
    if (alreadyExists) {
      res.json({
        message: "PRODUCT ALREADY EXIST IN DATABASE",
      });
    } else {
      const newProduct = new SellerProduct(req.body);
      await newProduct.save();
      if (newProduct) {
        res.status(200).json(newProduct);
      } else {
        res.status(500).json({
          error: "THIS WAS A SERVER SIDE ERROR",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// find id and update rating
SellerRoute.post("/product_rating/:id/rating", async (req, res) => {
  const id = req.params.id;
  const { rating } = req.body;
  try {
    const review = await SellerProduct.findByIdAndUpdate(
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
    res.json({ message: "Server error" });
  }
});

// find by catgegori wise product
SellerRoute.get("/category_products", async (req, res) => {
  try {
    const categoryProducts = req.query.category;
    const product = await SellerProduct.find({ category: categoryProducts })
      .limit(1)
      .exec();
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = SellerRoute;
