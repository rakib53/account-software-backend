const mongoose = require("mongoose");

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      default: "",
    },
    code: {
      type: String,
      required: true,
      default: "",
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
      required: false,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      default: "",
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

// Sale List Schema
const SaleListSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      default: "N/A",
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    note: {
      type: String,
      default: "",
    },
    paymentType: {
      type: String,
      enum: ["digital-payment", "due-amount", "cash-payment"],
      required: true,
    },
  },
  { timestamps: true }
);

// Exporting both models
const Product = mongoose.model("Product", ProductSchema);
const SaleListModel = mongoose.model("SaleList", SaleListSchema);

module.exports = { Product, SaleListModel };
