const { Product, SaleListModel } = require("../model/product.model");

// Creating a new product.
const createProduct = async (req, res, next) => {
  try {
    // Creating the product object for database
    const newProduct = await new Product(req?.body);
    // Storing the user information to database and gives front end response
    const createdProduct = await newProduct.save();

    if (createdProduct?._id) {
      res.status(201).json({
        product: createdProduct,
        message: "Product added successfully",
      });
    } else {
      res.status(500).json({ message: "Failed to add product" });
    }
  } catch (error) {
    next(error);
  }
};

// Add a new sale
const addNewSale = async (req, res) => {
  const { productCode } = req.body;

  try {
    if (!productCode) {
      return res.status(400).json({ message: "Product code is required" });
    }

    const result = await Product.findOne({ code: productCode });
    if (result) {
      res
        .status(200)
        .json({ message: "Sale added successfully", product: result });
    }
  } catch (error) {
    console.log(error);
  }
};

// get all the sale list
const getAllSaleLists = async (req, res) => {
  try {
    const result = await SaleListModel.find();
    if (result) {
      res.status(200).json({ saleLists: result });
    }
  } catch (error) {
    console.log(error);
  }
};

const addNewSaleList = async (req, res) => {
  try {
    const result = await SaleListModel.insertMany(req.body?.saleList);
    if (result) {
      res
        .status(200)
        .json({ message: "Sale list added successfully", saleLists: result });
    }
  } catch (error) {
    console.log(error);
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
      res.status(500).json({ message: "Failed to get products" });
    }
  } catch (error) {
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
  }
};

module.exports = {
  createProduct,
  addNewSale,
  getProductList,
  deleteProduct,
  addNewSaleList,
  getAllSaleLists,
};
