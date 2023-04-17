const express = require("express");
const PaymentRoute = express.Router();
const jwt = require("jsonwebtoken");
const SSLCommerzPayment = require('sslcommerz-lts')
require("dotenv").config();
const paymentData = require("../Scema/PaymentScema/PaymentScema");
const { default: mongoose } = require("mongoose");
const product = require("../Scema/SellerScema/PostSellerScema");
const { ObjectId } = require("mongodb");
const SellerProduct = new mongoose.model("SellerProduct", product);
const Payment = new mongoose.model("Payment", paymentData);

PaymentRoute.use(express.json());

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWORD
const is_live = false //true for live, false for sandbox


// test route
PaymentRoute.get("/", async (req, res) => {
    try {
        const data = await Payment.find({})
        res.status(200).json({
            result: data,
            message: "success"
        })
    }
    catch (err) {
        res.status(500).json({
            message: "server error"
        })
    }
    // res.send("Payment");
    // console.log(Payment);
});


// post a product
PaymentRoute.post("/", async (req, res) => {
    const newPaymentData = new Payment(req.body);

    const data = {
        total_amount: newPaymentData.price,
        currency: newPaymentData.currency,
        tran_id: newPaymentData.transactionId, // use unique tran_id for each api call
        success_url: `https://agrohub-b2b-backend.vercel.app/payment-gateway/payment/success?transactionId=${newPaymentData?.transactionId}`,
        fail_url: `https://agrohub-b2b-backend.vercel.app/payment-gateway/payment/fail?transactionId=${newPaymentData?.transactionId}`,
        cancel_url: 'https://agrohub-b2b-backend.vercel.app/payment/cancel',
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
        newPaymentData.save();
        res.json({ url: GatewayPageURL })
    });
})

PaymentRoute.post('/payment/success', async (req, res) => {
    const { transactionId } = req.query;
    // console.log(id, transactionId)
   const findProduct = await Payment.findOne({transactionId: transactionId})
   console.log("productis",findProduct)
    await Payment.updateOne({ transactionId: transactionId }, { $set: { paid: true, paidAt: new Date() } })
    // console.log(transactionId);
    // await SellerProduct.updateOne({_id: new ObjectId(id) }, {$set:{totalSells: 1 }})
    res.redirect(`https://agrohubb2b.netlify.app/payment-gateway/payment/success?transactionId=${transactionId}`)
})

PaymentRoute.get('/payment/success', async (req, res) => {
    const { transactionId } = req.query;
   const findProduct = await Payment.findOne({transactionId: transactionId})
   if(findProduct){
    const getProduct = await SellerProduct.updateOne({_id: findProduct?.productId}, {$inc:{totalSells: 1}})
    res.send(getProduct)
   }
   const getQuantity = await SellerProduct.findOne({_id: findProduct?.productId})
   if(getQuantity?.totalQuantity > 0){
    res.send({message: "total quantity not goes to less 0"})
   }
   else{
    const updateQuantity = await SellerProduct.updateOne({_id: findProduct?.productId}, {$inc:{totalQuantity: -1}})
    res.send(updateQuantity)
   }
   console.log("productis",findProduct)
    })

    
PaymentRoute.post('/payment/fail', async (req, res) => {
    const { transactionId } = req.query;
    await Payment.deleteOne({ transactionId: transactionId })
    // console.log(transactionId);
    res.redirect(`https://agrohubb2b.netlify.app/payment-gateway/payment/fail?transactionId=${transactionId}`)
})


PaymentRoute.get("/orders-by-transaction-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Payment.findOne({ transactionId: id })
        res.status(200).json({
            result: data,
            message: "success"
        })
    }
    catch (err) {
        res.status(500).json({
            message: "server error"
        })
    }
});

PaymentRoute.get("/all_Product/:id", async (req, res) => {
    try {
        const data = await SellerProduct.findById(req.params.id).lean();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "An error occurred while retrieving the product",
        });
    }
});

module.exports = PaymentRoute;
