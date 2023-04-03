const express = require("express");
const Commonroute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userSchema = require("../Schema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userSchema);

Commonroute.use(express.json());

// test route
Commonroute.get("/", (req, res) => {
  res.send("Commonroute");
});

module.exports = Commonroute;
