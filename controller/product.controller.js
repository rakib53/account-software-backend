const Product = require("../model/product.model");

// Creating a new User.
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

const getProductList = async (req, res, next) => {
  const { limit = 12, page = 1 } = req?.query;
  try {
    const totalProducts = await Product.countDocuments();
    console.log(totalProducts);
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

module.exports = { createProduct, getProductList, deleteProduct };
