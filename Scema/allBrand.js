const mongoose = require("mongoose")
const Brands = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, "Please Enter brand Name"],
        
      },
      category: {
        type: String,
        required: [true, "Please Enter category Name"],
        
      },
})

module.exports =  Brands