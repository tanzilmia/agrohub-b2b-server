const CartProduct = require("../Scema/CartProductModal");

exports.createCartProduct = async (req, res) => {
  try {
    let CartProducts = await CartProduct.findOne({ Email: req.body.Email });
    if (!CartProducts) {
      const NewCartProducts = await CartProduct.create(req.body);
      res.status(200).send({
        success: true,
        message: "Product add to cart Successfully",
        NewCartProducts,
      });
    }
    CartProducts = await CartProduct.findOneAndUpdate(
      { Email: req.body.Email },
      {
        $inc: {
          productCount: req.body.productCount,
          countPrice: req.body.countPrice,
        },
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Product Update to cart Successfully",
      CartProducts,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: "(❁´◡`❁)🥴🥴🥴🥴🥲🥲🥲",
      ErrorMessage: error.message,
    });
  }
};

exports.getAllCartProducts = async (req, res, next) => {
  try {
    const CartProducts = await CartProduct.find({ Email: req.body.Email });
    res.status(200).send({
      success: true,
      CartProducts,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error.message,
    });
  }
};
