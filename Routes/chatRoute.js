const express = require("express");
const ChatRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);

ChatRoute.get("/", (req, res) => {
  res.send("Chat route is running");
});

ChatRoute.get("/search-seller", async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
          role: "seller"
        }
      : {};

      console.log(keyword);
      const allUser = await User.find(keyword)
      res.send(allUser)
      
  } catch (e) {}
});


ChatRoute.post("/accessChat", async (req, res) => {
    res.send("Chat route is running");
  });
ChatRoute.get("/fetchChat", async (req, res) => {
    res.send("Chat route is running");
  });
ChatRoute.post("/create-groupChat", async (req, res) => {
    res.send("Chat route is running");
  });
ChatRoute.put("/nenameGroup", async (req, res) => {
    res.send("Chat route is running");
  });
ChatRoute.put("/remove-fromGrop", async (req, res) => {
    res.send("Chat route is running");
  });
ChatRoute.put("/addto-Group", async (req, res) => {
    res.send("Chat route is running");
  });

ChatRoute.get("/")


module.exports = ChatRoute;
