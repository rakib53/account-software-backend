const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserRouter = require("./routes/user.router");
const ProductRouter = require("./routes/product.router");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// User API

app.use("/api/v1/", UserRouter);
app.use("/api/v1/", ProductRouter);

// Error Handling
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status).json({ message: "Something went wrong!!" });
  }
});

module.exports = app;
