const { Types } = require("mongoose");
const { Product, SaleListModel } = require("../model/product.model");

// Creating a new product.
const createProduct = async (req, res, next) => {
  try {
    // Find the product with the product code
    const isExistingProductWithCode = await Product.findOne({
      code: req?.body?.code,
    });
    if (isExistingProductWithCode) {
      res.status(400).json({ message: "Dulicate product code detected." });
      return;
    }
    // Creating the product object for database
    const newProduct = new Product(req?.body);
    // Storing the user information to database and gives front end response
    const createdProduct = await newProduct.save();

    if (createdProduct?._id) {
      res.status(201).json({
        product: createdProduct,
        message: "Product added successfully.",
      });
    } else {
      res.status(500).json({ message: "Failed to add product." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Response product info to the client through product code
const addNewSale = async (req, res, next) => {
  const { productCode } = req.body;

  try {
    if (!productCode) {
      return res.status(400).json({ message: "Product code is required." });
    }

    const result = await Product.findOne({ code: productCode });
    if (result) {
      res
        .status(200)
        .json({ message: "Sale added successfully.", product: result });
    } else {
      res
        .status(404)
        .json({ status: 404, message: "Invalid product code.", product: [] });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Getting all the sales list
const getAllSaleLists = async (req, res, next) => {
  try {
    const result = await SaleListModel.find();
    if (result) {
      res.status(200).json({ saleLists: result });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Adding new sale list
const addNewSaleList = async (req, res, next) => {
  try {
    // Insert the sales list into the database
    const result = await SaleListModel.insertMany(req.body?.saleList);

    // Prepare bulk update operations for updating stock
    const bulkOperations = req.body?.saleList?.map((sale) => ({
      updateOne: {
        filter: { _id: sale?.id }, // Find the product by ID
        update: { $set: { stock: sale?.stock } }, // Update the stock
      },
    }));

    // Execute bulk write to update all stocks in one operation
    if (bulkOperations.length > 0) {
      await Product.bulkWrite(bulkOperations);
    }

    // Respond with success message
    if (result) {
      res.status(200).json({
        message: "Sale list added and stocks updated successfully.",
        saleLists: result,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Deleting a sale list
const deleteSale = async (req, res, next) => {
  const { saleId } = req.params;
  try {
    if (typeof saleId !== "string" || !Types.ObjectId.isValid(saleId)) {
      return res.status(400).json({ message: "Invalid sale Id." });
    }
    const deletedSale = await SaleListModel.deleteOne({ _id: saleId });
    if (deletedSale) {
      res.status(200).json({
        message: "Sale deleted successfully.",
        deletedSale: deletedSale,
      });
    } else {
      res.status(300).json({
        message: "Error occured while deleing sale.",
        deletedSale: {},
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// get all products
const getProductList = async (req, res, next) => {
  const { limit = 12, page = 1 } = req?.query;
  try {
    const totalProducts = await Product.countDocuments();
    // finding all the product list
    const productList = await Product.find({}).limit(limit);
    if (productList) {
      res.status(201).json({
        products: productList,
        totalProducts,
        currentPage: page,
      });
    } else {
      res.status(500).json({ message: "Failed to get products." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Deleting a product
const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const isDeletedProduct = await Product.deleteOne({ _id: productId });
    if (!isDeletedProduct) {
      res.status(404).json({ message: "Error while deleting product!" });
    }
    if (isDeletedProduct?.acknowledged) {
      res.status(200).json({
        message: "Successfully deleted product!",
        data: isDeletedProduct,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server errors!",
      error: error,
    });
    next(error);
  }
};

module.exports = {
  createProduct,
  addNewSale,
  getProductList,
  deleteProduct,
  addNewSaleList,
  getAllSaleLists,
  deleteSale,
};
