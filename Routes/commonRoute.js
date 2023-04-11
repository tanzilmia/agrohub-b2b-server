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

Commonroute.get("/sellers", async (req, res) => {
  try {
    const allSellers = await User.find({role:"seller"});
    res.send(allSellers);
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
