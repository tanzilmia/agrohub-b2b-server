const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./Routes/authentication");
const admin = require("./Routes/adminroute");
const seller = require("./Routes/sellerRoute");
const common = require("./Routes/commonRoute");
const payment = require("./Routes/paymentRoute");
const chatRoute = require("./Routes/chatRoute");
const review = require("./Routes/reviewRoute");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// check .env file for databes user and password and give a Name
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nz3kcdw.mongodb.net/Agrohub?retryWrites=true&w=majority`;

// conncet with mongodb
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connceted mongoose");
  })
  .catch((e) => console.log(e));

// all Routes
const product = require("./Routes/productRouter");
app.use("/auth", auth);
app.use("/admin", admin);
app.use("/seller", seller);
app.use("/common", common);
app.use("/payment-gateway", payment);
app.use("/products", product);
app.use("/chat", chatRoute);
app.use("/review", review);

app.listen(port, () => {
  console.log(` Website on port ${port}`);
});
