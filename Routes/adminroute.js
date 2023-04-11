const express = require("express");
const AdminRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);
const CategorysScema = require("../Scema/allCategory");
const BrandsScema = require("../Scema/allBrand");
// Makeing Model
const Category = new mongoose.model("Categorys", CategorysScema);
const Brand = new mongoose.model("Brands", BrandsScema);

AdminRoute.use(express.json());

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

// post Category and brand
AdminRoute.post("/brands", verifyToken, async (req, res) => {
  try {
    const brand = req.body;
    const alreadyExist = await Brand.findOne({ brand: brand.brand, category:brand.category });
    console.log(alreadyExist);
    if (alreadyExist) {
      res.send({ message: "Failed", error: "brand already exists" });
    } else {
      const newbrand = new Brand(brand);
      await newbrand.save();
      res.send({ message: "Success"});
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get all brands

AdminRoute.get("/brands", async (req, res) => {
    try {
      const categoryname = req.query.category
      const brans = await Brand.find({category:categoryname});
      res.send(brans);
    } catch (e) {
      res.send({ message: e.message });
    }
  });



AdminRoute.post("/categories", verifyToken, async (req, res) => {
  try {
    const categorys = req.body; // Extract the "category" value from the request body

    const alreadyExist = await Category.findOne({
      category: categorys.category,
    });

    // Check if the category already exists in the database
    console.log(alreadyExist);

    if (alreadyExist) {
      res.send({ message: "Failed", error: "Category already exists" }); // Respond with error message if category already exists
    } else {
      const newCategory = new Category(categorys); // Create a new category instance

      await newCategory.save(); // Save the new category to the database

      res.send({ message: "Success", data: newCategory });
    }

    // Respond with success message and the created category data
  } catch (err) {
    console.error(err); // Log any unexpected errors
    res.send({ message: "Internal server error" }); // Respond with a generic error message for internal server errors
  }
});

AdminRoute.get("/categories", async (req, res) => {
  try {
    const categorys = await Category.find();
    res.send(categorys);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// test route
AdminRoute.get("/", (req, res) => {
  res.send("adminRoute");
});

module.exports = AdminRoute;
