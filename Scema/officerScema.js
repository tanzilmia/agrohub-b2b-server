const mongoose = require("mongoose");
const officerScema = new mongoose.Schema({
    doctorPic:String,
    officerName:String,
    officerPhone:Number,
    officerEmail:String,
    facebookUrl:String,
});

const Officer = new mongoose.model("Officer", officerScema)
module.exports = Officer