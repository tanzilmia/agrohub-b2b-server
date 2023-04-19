const express = require("express");
const ChatRoute = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);
const Chat = require("../Model/chatModel");
const Message = require("../Model/messageModel");

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(403).send({ message: "Unauthorized Access" });
    }
    if (authorization) {
      const token = authorization.split(" ")[1];
      const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`);
      const { email, _id } = decoded; // Add _id to the destructured object
      req.user = { _id }; // Set the req.user object with _id
      if (email === req.query.email) {
        next();
      } else {
        return res.status(403).send({ message: "Unauthorized" });
      }
    }
  } catch (err) {
    return next("Private Api");
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

// access chats

ChatRoute.post("/accessChat", verifyToken, async (req, res) => {
  try {
    let chatData; // Declare the variable here

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
      .populate({
        path: "latestMessage.sender",
        select: "name profilePic email",
      });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.send(fullChat);
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
});

// fetch chats
ChatRoute.get("/fetchChat", verifyToken, async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name profilePic email",
        });
        res.status(200).send(result);
      });
  } catch (e) {
    res.send(e.message);
  }
});

ChatRoute.post("/sendMessage", verifyToken, async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      console.log("invalid data pass into request");
      return res.sendStatus(400);
    }
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.send(message);
  } catch (e) {
    res.send(e.message);
  }
});


// get message

ChatRoute.get("/:chatId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePic email")
      .populate("chat");

      res.send(messages)
  } catch (e) {
    res.send(e.message);
  }
});



ChatRoute.get("/");

module.exports = ChatRoute;
