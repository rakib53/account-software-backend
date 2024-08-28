const mongoose = require("mongoose");

const User = mongoose.Schema({
  userName: {
    type: String,
    require: false,
    default: "",
  },
  phone: {
    type: Number,
    require: false,
    default: "",
  },
  email: {
    type: String,
    require: true,
    default: "",
  },
  password: {
    type: String,
    require: true,
    default: "",
  },
  gender: {
    type: String,
    require: false,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "admin",
  },
  date: {
    type: String,
    require: false,
    default: "",
  },
  country: {
    type: String,
    require: false,
    default: "Bangladesh",
  },
  avatar: {
    type: String,
    require: false,
    default: "",
  },
});

module.exports = mongoose.model("User", User);
