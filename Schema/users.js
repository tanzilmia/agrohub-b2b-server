const mongoose =  require("mongoose")
const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    role:String,
    phone:String,
    profilePic:String

})

module.exports = userSchema