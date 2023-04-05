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
  const newProduct = new SellerProduct(req.body);

  await newProduct
    .save()
    .then(() => {
      res.status(200).json({
        message: "SELLER PRODUCT INSERTED SUCCESSFULLY",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: "THIS WAS A SERVER SIDE ERROR",
      });
    });
});

module.exports = SellerRoute;
