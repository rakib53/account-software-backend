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

// get product info
const getProductInfo = async (req, res, next) => {
  const { productId } = req?.params;
  try {
    const product = await Product.findById(productId);
    if (product) {
      res.status(200).json({ product });
    } else {
      res.status(404).json({ message: "No Product Found.", product: {} });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Update a product
const updateProduct = async (req, res, next) => {
  const { productId } = req?.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "No product found." });
      return;
    }
    // updating product info
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req?.body,
      { upsert: true, new: true }
    );
    if (updatedProduct) {
      res.status(200).json({
        message: "Updated product successfully",
        updatedProduct,
      });
    } else {
      res.status(400).json({
        message: "Error occured while updating product info",
      });
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
  // Destructure limit and page from the query, defaulting to undefined
  const { limit, page } = req.query;

  // Parse limit and page if they are provided, otherwise keep them undefined
  const parsedLimit = limit ? parseInt(limit, 10) : undefined;
  const parsedPage = page ? parseInt(page, 10) : undefined;

  try {
    // Get total sales count for pagination
    const totalSales = await SaleListModel.countDocuments();

    // If both limit and page are provided, calculate skip and limit for pagination
    const skip = parsedPage && parsedLimit ? (parsedPage - 1) * parsedLimit : 0;

    // Build the query for finding the sales list
    let query = SaleListModel.find().populate({
      path: "product",
      select: "title buyingPrice sellingPrice",
    });

    // Apply pagination if limit and page are provided
    if (parsedLimit && parsedPage) {
      query = query.skip(skip).limit(parsedLimit);
    }

    // Execute the query
    const result = await query;

    if (result) {
      res.status(200).json({
        saleLists: result,
        totalSales,
        currentPage: parsedPage || null,
        totalPages: parsedLimit ? Math.ceil(totalSales / parsedLimit) : null,
      });
    } else {
      res.status(404).json({ message: "No sales lists found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Getting a sale info
const getSaleInfo = async (req, res, next) => {
  const { saleId } = req?.params;
  try {
    const saleInfo = await SaleListModel.findById(saleId).populate({
      path: "product",
      select: "title buyingPrice sellingPrice stock",
    });
    if (saleInfo) {
      res.status(200).json({ saleInfo });
    } else {
      res.status(500).json({
        message: "Error occured while getting sale info.",
        error: error,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Updating a sale
const updateSale = async (req, res, next) => {
  const { saleId } = req.params;
  try {
    const isSaleExitst = await SaleListModel.findById(saleId);
    if (isSaleExitst) {
      await Product.findByIdAndUpdate(
        req?.body?.product,
        { stock: req?.body?.stock },
        { new: true }
      );
      const isSaleUpdated = await SaleListModel.findByIdAndUpdate(
        saleId,
        req?.body,
        { new: true }
      );
      if (isSaleUpdated) {
        res.status(200).json({
          message: "Sale updated successfully.",
          saleInfo: isSaleUpdated,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error });
    next(error);
  }
};

// Adding new sale list
const addNewSaleList = async (req, res, next) => {
  try {
    // Ensure the sale list contains the product reference
    const saleListWithProduct = req.body?.saleList?.map((sale) => ({
      product: sale?.id,
      code: sale?.code,
      title: sale?.title,
      buyingPrice: sale?.buyingPrice,
      sellingPrice: sale?.sellingPrice,
      discount: sale?.discount,
      amount: sale?.amount,
      quantity: sale?.quantity,
      note: sale?.note,
      paymentType: sale?.paymentType,
    }));
    // Insert the sales list into the database
    const result = await SaleListModel.insertMany(saleListWithProduct);

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

    // Now, populate the product field in the inserted sale list
    const populatedSaleList = await SaleListModel.find({
      _id: { $in: result.map((sale) => sale._id) },
    }).populate({
      path: "product",
      select: "title buyingPrice sellingPrice",
    });

    // Respond with success message
    if (populatedSaleList) {
      // Respond with success message and populated sale list
      res.status(200).json({
        message: "Sale list added.",
        saleLists: populatedSaleList,
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
// const getProductList = async (req, res, next) => {
//   const { limit = 12, page = 1 } = req.query;

//   // Parse limit and page to ensure they are numbers (in case they're passed as strings)
//   const parsedLimit = parseInt(limit, 10);
//   const parsedPage = parseInt(page, 10);

//   try {
//     // Get the total number of products
//     const totalProducts = await Product.countDocuments();

//     // Calculate the number of documents to skip for pagination
//     const skip = (parsedPage - 1) * parsedLimit;

//     // Find the products with limit and skip for pagination
//     const productList = await Product.find({}).skip(skip).limit(parsedLimit);

//     // Check if the product list exists and send response
//     if (productList) {
//       res.status(200).json({
//         products: productList,
//         totalProducts,
//         currentPage: parsedPage,
//         totalPages: Math.ceil(totalProducts / parsedLimit), // Calculate total pages
//       });
//     } else {
//       res.status(404).json({ message: "No products found." });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error.", error: error });
//     next(error);
//   }
// };

// Get all products
const getProductList = async (req, res, next) => {
  // Destructure limit and page from query parameters, defaulting to undefined if not provided
  const { limit, page } = req.query;

  // Parse limit and page if they are provided, otherwise keep them undefined
  const parsedLimit = limit ? parseInt(limit, 10) : undefined;
  const parsedPage = page ? parseInt(page, 10) : undefined;

  try {
    // Get the total number of products
    const totalProducts = await Product.countDocuments();

    // Calculate the number of documents to skip for pagination if pagination is applied
    const skip = parsedPage && parsedLimit ? (parsedPage - 1) * parsedLimit : 0;

    // Build the query for finding the products
    let query = Product.find();

    // Apply pagination if limit and page are provided
    if (parsedLimit && parsedPage) {
      query = query.skip(skip).limit(parsedLimit);
    }

    // Execute the query
    const productList = await query;

    // Check if the product list exists and send response
    if (productList) {
      res.status(200).json({
        products: productList,
        totalProducts,
        currentPage: parsedPage || null,
        totalPages: parsedLimit ? Math.ceil(totalProducts / parsedLimit) : null, // Total pages only if paginated
      });
    } else {
      res.status(404).json({ message: "No products found." });
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
  getProductInfo,
  updateProduct,
  getSaleInfo,
  updateSale,
};
