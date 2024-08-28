const app = require("./app");
const config = require("./config/config");
require("./config/db");

app.get("/", (req, res) => {
  res.status(201).json({ message: "Account software backend server." });
});

app.use("*", (req, res) => {
  res.status(400).json({ message: "Routes not Found!!!" });
});

// Listening to the express app
app.listen(config.app.port, () => {
  console.log(
    `Account software server is running at http://localhost:${config.app.port}`
  );
});
