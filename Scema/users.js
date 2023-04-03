const mongoose =  require("mongoose")
const userScema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    role:String,
    phone:String,
    profilePic:String

})

module.exports = userScema