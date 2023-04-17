const express = require("express");
const Auth = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scema/users");
const { default: mongoose } = require("mongoose");
const User = new mongoose.model("User", userscema);

// middleware

Auth.use(express.json());

// google auth data received
Auth.post("/google", async (req, res) => {
  try {
    const GoogleData = req.body;
    var decodedData = await jwt.decode(GoogleData.credential);
    console.log(decodedData.email);
  } catch (error) {
    res.send({ message: error.message, success: false });
  }
});

// google auth data end
Auth.post("/register", async (req, res) => {
  try {
    const userinfos = req.body;
    const { name, email, password, role, phone, profilePic } = userinfos;
    const encrypedPass = await bcrypt.hash(password, 10);
    const alreadyExist = await User.findOne({ email: email });
    if (alreadyExist) {
      res.send({ message: "Email Is Already Used" });
    } else {
      const user = new User({
        name,
        email,
        password: encrypedPass,
        role,
        phone,
        profilePic,
      });
      await user.save();
      res.status(200).send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: e.message });
  }
});

// login

Auth.post("/login", async (req, res) => {
  try {
    const userinfo = req.body;
    const { email, password } = userinfo;
    const validuser = await User.findOne({ email: email });
    const validPass = await bcrypt.compare(password, validuser.password);
    if (validuser) {
      if (validPass) {
        const token = jwt.sign(
          { email: validuser.email, _id:validuser._id },
          `${process.env.JWT_SECRET}`,
          { expiresIn: "1d" }
        );
        res.status(200).send({ message: "Login Successful", data: token });
      } else {
        res.send({ message: "password not Match" });
      }
    } else {
      res.send({ message: "user not Valid" });
    }
  } catch (e) {}
});

// get login user data

Auth.post("/user-info", async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = user.email;
    const userdata = await User.findOne({ email: userEmail });
    if (userdata) {
      res.status(200).send({ message: "successfull", data: userdata });
    } else {
      res.status(400).send({ message: "Not Valid User" });
    }
  } catch (e) {}
});

// get seller data
Auth.get("/seller", async (req, res) => {
  try {
    const data = await User.find({ role: "seller" }).limit(5).lean();
    res.send(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "An error occurred while retrieving the products",
    });
  }
});

Auth.delete("/user_delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error deleting review");
  }
});

module.exports = Auth;
