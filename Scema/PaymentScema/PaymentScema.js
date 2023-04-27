const { default: mongoose } = require("mongoose");

const paymentScema = mongoose.Schema({
    productId:String,
    name: String,
    email: String,
    sellerEmail:String,
    phoneNo: Number,
    productName: String,
    address: String,
    city: String,
    country: String,
    postCode: Number,
    currency: String,
    price: Number,
    transactionId: Number,
    paid: Boolean
});

module.exports = paymentScema;
