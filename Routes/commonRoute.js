const express = require("express");
const Commonroute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);

Commonroute.use(express.json());

// test route
Commonroute.get("/", (req, res) => {
  res.send("Commonroute");
});

module.exports = Commonroute;
