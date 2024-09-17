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
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const whitelist = [
        "http://localhost:5173",
        "https://fashionable-outfits.com",
      ];
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

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
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
