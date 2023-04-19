const Product = require("../Scema/productModal");
// create product
exports.createProduct = async (req, res, next) => {
  try {
    // req.body.user = req.user.id;
    
    const product = await Product.create(req.body);
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error.message,
    });
  }
};
// get al//the product
exports.getAllProducts = async (req, res, next) => {
  try {
    const product = await Product.find();
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error.message,
    });
  }
};
exports.getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: `product not found with this id ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error.message,
    });
  }
};

// update id/by product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(401).send({
        success: false,
        message: `product not found with this id ${req.params.id}`,
      });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
};
// delete product use id
exports.deleteIdByProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: `product not found with this id ${req.params.id}`,
      });
    }
    product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: ` ${req.params.id} this product delete successfully`,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
};
