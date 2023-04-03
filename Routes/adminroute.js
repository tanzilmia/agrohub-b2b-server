
const express = require("express");
const AdminRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);



AdminRoute.use(express.json());

// test route
AdminRoute.get("/", (req,res)=>{
    res.send("adminRoute")
})


module.exports = AdminRoute;
