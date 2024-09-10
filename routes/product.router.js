const {
  createProduct,
  getProductList,
  deleteProduct,
  addNewSale,
  addNewSaleList,
  getAllSaleLists,
  deleteSale,
  getProductInfo,
  updateProduct,
  getSaleInfo,
  updateSale,
} = require("../controller/product.controller");
const router = require("express").Router();

router.get("/get-sale-lists", getAllSaleLists);
router.get("/get-product/:productId", getProductInfo);
router.get("/get-sale/:saleId", getSaleInfo);
router.post("/add-new-sale", addNewSale);
router.post("/add-new-sale-list", addNewSaleList);
router.post("/create-product", createProduct);
router.get("/get-product-list", getProductList);
router.put("/update-product/:productId", updateProduct);
router.put("/update-sale/:saleId", updateSale);
router.delete("/delete-sale/:saleId", deleteSale);
router.delete("/delete-product/:productId", deleteProduct);
module.exports = router;
