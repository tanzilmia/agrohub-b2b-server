const mongoose = require("mongoose")
const Categorys = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "Please Enter category Name"],
        trim: true,
        
      },
      thumnail: {
        type: String,
        required: [true, "Please Enter thumnail Name"],
        
      },
})

module.exports = Categorys