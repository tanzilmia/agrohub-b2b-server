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
    console.log("connected to mongoose");
  })
  .catch((e) => console.log(e));

// all Routes
const product = require("./Routes/productRouter");
const CartProduct = require("./Routes/cartProductrouter") 
app.use("/auth", auth);
app.use("/admin", admin);
app.use("/seller", seller);
app.use("/common", common);
app.use("/payment-gateway", payment);
app.use("/products", product);
app.use("/chat", chatRoute);
app.use("/review", review);
app.use("/CartProduct", CartProduct );
const server = app.listen(port, () => {
  console.log(`Website on port ${port}`);
});

const io = require("socket.io")(server, { 
  pingTimeout: 60000,
  cors: {
    origin: "https://agrohubb2b.netlify.app",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    if (!userData?._id) {
      // Handle error: userData or userData._id is missing
      socket.emit("error", { message: "Invalid setup data" });
      return;
    }
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    if (!room) {
      // Handle error: room is missing
      socket.emit("error", { message: "Invalid chat room data" });
      return;
    }
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("new message", (newMessageRecive) => {
    if (!newMessageRecive?.chat || !newMessageRecive?.sender?._id) {
      // Handle error: newMessageRecive or newMessageRecive.chat or newMessageRecive.sender or newMessageRecive.sender._id is missing
      socket.emit("error", { message: "Invalid message data" });
      return;
    }
    var chat = newMessageRecive.chat;
    if (!chat?.users) {
      // Handle error: chat.users is missing
      socket.emit("error", { message: "chat.users not found" });
      return;
    }
    chat.users.forEach(user => {
      if (user._id === newMessageRecive.sender._id) return;
      socket.in(user._id).emit("message receive", newMessageRecive);
    });
  });
});


