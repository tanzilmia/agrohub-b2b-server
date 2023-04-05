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

// get a product
SellerRoute.get("/selleingProduct", (req, res) => {});

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
  } catch (error) {}
});

module.exports = SellerRoute;
