const mongoose = require("mongoose");

const Product = mongoose.Schema(
  {
    productName: {
      type: String,
      require: true,
      default: "",
    },
    productCategory: {
      type: String,
      require: true,
      default: "",
    },
    productCode: {
      type: String,
      require: true,
      default: "",
    },
    purchasePrice: {
      type: Number,
      require: true,
      default: "",
    },
    sellingPrice: {
      type: Number,
      require: true,
      default: "",
    },
    note: {
      type: String,
      require: false,
      default: "",
    },
    quantity: {
      type: Number,
      require: true,
      default: "",
    },
    productDescription: {
      type: String,
      require: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Product);
