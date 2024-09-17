const mongoose = require("mongoose");
const config = require("./config");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.database_url);
    console.log(`MongoDb is connected to: ${config.database_url}`);
  } catch (err) {
    console.log(err);
  }
};

connectMongoDB();
