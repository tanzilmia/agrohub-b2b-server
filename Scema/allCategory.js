const mongoose = require("mongoose")
const Categorys = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "Please Enter category Name"],
        
      },
})

module.exports = Categorys