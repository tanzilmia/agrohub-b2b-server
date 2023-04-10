const { default: mongoose } = require("mongoose");

const paymentScema = mongoose.Schema({
    name: String,
    email: String,
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
