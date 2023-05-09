const mongoose = require("mongoose");
const doctorScema = new mongoose.Schema({
  doctorPic:String,
  doctorName:String,
  doctorPhone:Number,
  doctorEmail:String,
  facebookUrl:String,
});

const Doctor = new mongoose.model("Doctor", doctorScema)
module.exports = Doctor
