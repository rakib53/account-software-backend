const {
  createProduct,
  getProductList,
  deleteProduct,
} = require("../controller/product.controller");
const router = require("express").Router();

router.get("/get-product-list", getProductList);
router.post("/create-product", createProduct);
router.delete("/delete-product/:productId", deleteProduct);
module.exports = router;
