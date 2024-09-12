const mongoose = require("mongoose");
const config = require("./config");

// mongoose.set("strictQuery", false);

mongoose
  .connect(config.database_url)
  .then(() => {
    console.log(`MongoDb is connected to: ${config.database_url}`);
  })
  .catch((err) => {
    console.log(err);
  });
