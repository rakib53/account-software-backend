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
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    default: "",
  },
  gender: {
    type: String,
    require: false,
  },
  role: {
    type: String,
    enum: ["editor", "admin", "viewer"],
    default: "viewer",
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
