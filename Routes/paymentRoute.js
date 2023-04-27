const express = require("express");
const PaymentRoute = express.Router();
const jwt = require("jsonwebtoken");
const SSLCommerzPayment = require("sslcommerz-lts");
require("dotenv").config();
const paymentData = require("../Scema/PaymentScema/PaymentScema");
const { default: mongoose } = require("mongoose");
const product = require("../Scema/SellerScema/PostSellerScema");
const { ObjectId } = require("mongodb");
const SellerProduct = new mongoose.model("SellerProduct", product);
const Payment = new mongoose.model("Payment", paymentData);

PaymentRoute.use(express.json());

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

// test route
PaymentRoute.get("/", async (req, res) => {
  try {
    const data = await Payment.find({});
    res.status(200).json({
      result: data,
      message: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
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
    cancel_url: "https://agrohub-b2b-backend.vercel.app/payment/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: newPaymentData.productName,
    product_category: "Electronic",
    product_profile: "general",
    cus_name: newPaymentData.name,
    cus_email: newPaymentData.email,
    cus_add1: newPaymentData.address,
    cus_add2: "Dhaka",
    cus_city: newPaymentData.city,
    cus_state: "Dhaka",
    cus_postcode: newPaymentData.postCode,
    cus_country: newPaymentData.country,
    cus_phone: newPaymentData.phoneNo,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    sellerEmail:newPaymentData.sellerEmail
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    // console.log(apiResponse);
    newPaymentData.save();
    res.json({ url: GatewayPageURL });
  });
});

PaymentRoute.post("/payment/success", async (req, res) => {
  try {
    const { transactionId } = req.query;
    const findProduct = await Payment.findOne({ transactionId: transactionId });
    await Payment.updateOne(
      { transactionId: transactionId },
      { $set: { paid: true, paidAt: new Date() } }
    );
    res.redirect(
      `https://agrohubb2b.netlify.app/payment-gateway/payment/success?transactionId=${transactionId}`
    );
  } catch (error) {
    res.status(500).send({ error: " server error" });
  }
});

PaymentRoute.put("/update/success", async (req, res) => {
  try {
    const { transactionId } = req.query;
    const findProductByTransactionId = await Payment.findOne({ transactionId: transactionId });
    if (!findProductByTransactionId?.productId) {
      return res.status(500).send({ error: "something wrong" });
    } else {
      const getProduct = await SellerProduct.updateOne(
        { _id: findProductByTransactionId?.productId },
        { $inc: { totalSells: 1 } }
      );
      res.send(getProduct);
    }

  } catch (error) {
    res.status(500).send({ error: "Value not update" });
  } 
});


PaymentRoute.post("/payment/fail", async (req, res) => {
  const { transactionId } = req.query;
  await Payment.deleteOne({ transactionId: transactionId });
  // console.log(transactionId);
  res.redirect(
    `https://agrohubb2b.netlify.app/payment-gateway/payment/fail?transactionId=${transactionId}`
  );
});

PaymentRoute.get("/orders-by-transaction-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Payment.findOne({ transactionId: id });
    res.status(200).json({
      result: data,
      message: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
});

PaymentRoute.get("/payment-product", async (req, res) => {
  try {
    const email = req.query.email;
    const findByEmail = await Payment.find({ email: email });
    if (findByEmail) {
      res
        .status(200)
        .send({ result: findByEmail, message: "Find successfully" });
    } else {
      res.status(500).send({ error: "Payment product not find" });
    }
  } catch (error) {
    res.status(500).send({ error: "Server error" });
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
