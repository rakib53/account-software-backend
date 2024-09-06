const {
  createProduct,
  getProductList,
  deleteProduct,
  addNewSale,
  addNewSaleList,
  getAllSaleLists,
} = require("../controller/product.controller");
const router = require("express").Router();

router.get("/get-sale-lists", getAllSaleLists);
router.post("/add-new-sale", addNewSale);
router.post("/add-new-sale-list", addNewSaleList);
router.post("/create-product", createProduct);
router.get("/get-product-list", getProductList);
router.delete("/delete-product/:productId", deleteProduct);
module.exports = router;
