const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteIdByProduct,
  getProductById,
} = require("../controllers/productControllers");
const router = express.Router();

router.route("/newProduct").post(createProduct);
router.route("/allProduct").get(getAllProducts);
router.route("/:id").get(getProductById);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteIdByProduct);
module.exports = router;
