const express = require("express");
const ChatRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);
const Chat = require("../Model/chatModel");


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
          role: "seller",
        }
      : {};

    console.log(keyword);
    const allUser = await User.find(keyword);
    res.send(allUser);
  } catch (e) {}
});


ChatRoute.post("/accessChat", verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("User Id not found");
      return res.send("User Id not found");
    }

    const isChat = await Chat.find({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate({ path: "latestMessage.sender", select: "name profilePic email" });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");

      return res.send(fullChat);
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
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

ChatRoute.get("/");

module.exports = ChatRoute;
