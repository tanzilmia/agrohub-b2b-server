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
SellerRoute.get("/limitProduct", async (req, res) => {
  try {
    const data = await SellerProduct.find({}).limit(4).lean();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the products",
    });
  }
});

// get all product
SellerRoute.get("/allProduct", async (req, res) => {
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
SellerRoute.get("/allProduct/:id", async (req, res) => {
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

module.exports = SellerRoute;
