
const express = require("express");
const SellerRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userSchema = require("../Schema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userSchema);



SellerRoute.use(express.json());

// test route
SellerRoute.get("/", (req,res)=>{
    res.send("SellerRoute")
})


module.exports = SellerRoute;