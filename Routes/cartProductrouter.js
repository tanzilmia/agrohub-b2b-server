const express = require("express");
const {
  getAndCreateProductByEmail,
  createCartProduct,
  getAllCartProducts,
} = require("../controllers/CartProductControllers");
const router = express.Router();

router.route("/addcartproduct").post(createCartProduct);
router.route("/getcartproduct").get(getAllCartProducts);
module.exports = router;
