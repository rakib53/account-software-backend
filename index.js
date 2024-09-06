const express = require("express");
const app = express();
const config = require("./config/config");
require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserRouter = require("./routes/user.router");
const ProductRouter = require("./routes/product.router");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// User API
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/products", ProductRouter);

// Error Handling
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong!!";
  res.status(statusCode).json({ message });
});

// Root Route
app.get("/", (req, res) => {
  res.status(201).json({ message: "Account software backend server." });
});

// Catch-All Route for Undefined Routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

// Start the Express Server
app.listen(config.app.port, () => {
  console.log(`Server running at http://localhost:${config.app.port}`);
});
