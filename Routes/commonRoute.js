const express = require("express");
const Commonroute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);
const product = require("../Scema/SellerScema/PostSellerScema");
const SellerProduct = new mongoose.model("SellerProduct", product);

Commonroute.use(express.json());

// test route
Commonroute.get("/", (req, res) => {
  res.send("Commonroute");
});

Commonroute.get("/sellers", async (req, res) => {
  try {
    const allSellers = await User.find({role:"seller"});
    res.send(allSellers);
  } catch (e) {
    res.send({message: e.message})
  }
});


// single seller Info

Commonroute.get("/seller-product/:id", async (req, res) => {
  try {
    const seller = await User.findOne({_id:req.params.id});
    const sellerEmail = seller.email  
    const products = await SellerProduct.find({sellerEmail:sellerEmail})
    res.send(products)
  } catch (e) {
    res.send({message: e.message})
  }
});

Commonroute.get("/single-product/:id", async (req, res) => {
  try {
    const Edetedproduct = await SellerProduct.findOne({_id:req.params.id});
    res.send(Edetedproduct)
  } catch (e) {
    res.send({message: e.message})
  }
});

Commonroute.put("/edete-product", async (req, res) => {
  try {
    const id = req.query.id;
    const product = req.body;
    const {name,
      images,
      oldPrice,
      newPrice,
      size,
      description,
      category,
      brand} = product
      await SellerProduct.updateOne(
        { _id: id },
        {
          $set: {
            name,
            images,
            oldPrice,
            newPrice,
            size,
            description,
            category,
            brand
          },
        }
      );
      // const updateProductInfo = await SellerProduct.find({});
      res.send({message : "Update Success"});
   
  } catch (e) {
    res.send({message: e.message})
  }
});

Commonroute.get("/buyer", async (req, res) => {
  try {
    const allSellers = await User.find({role:"buyer"});
    res.send(allSellers);
  } catch (e) {
    res.send({message: e.message})
  }
});

module.exports = Commonroute;
