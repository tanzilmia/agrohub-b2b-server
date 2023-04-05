const express = require("express");
const PaymentRoute = express.Router();
const jwt = require("jsonwebtoken");
const SSLCommerzPayment = require('sslcommerz-lts')
require("dotenv").config();
const paymentData = require("../Scema/PaymentScema/PaymentScema");
const { default: mongoose } = require("mongoose");
const Payment = new mongoose.model("Payment", paymentData);

PaymentRoute.use(express.json());

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWORD
const is_live = false //true for live, false for sandbox


// test route
PaymentRoute.get("/", (req, res) => {
    res.send("PaymentRoute");
});


// post a product
PaymentRoute.post("/", async (req, res) => {
    const newPaymentData = new Payment(req.body);
    const data = {
        total_amount: newPaymentData.cvv,
        currency: newPaymentData.currency,
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: 'http://localhost:3030/success',
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: newPaymentData.productName,
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: newPaymentData.name,
        cus_email: newPaymentData.email,
        cus_add1: newPaymentData.address,
        cus_add2: 'Dhaka',
        cus_city: newPaymentData.city,
        cus_state: 'Dhaka',
        cus_postcode: newPaymentData.postCode,
        cus_country: newPaymentData.country,
        cus_phone: newPaymentData.phoneNo,
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        // console.log(apiResponse);
        res.send({ url: GatewayPageURL })
    });
})


module.exports = PaymentRoute;
