require("dotenv").config();

const dev = {
  port: process.env.PORT || 5000,
  node_env: process.env.SERVER_TYPE,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  database_url:
    process.env.SERVER_TYPE === "production"
      ? process.env.REMOTE_DATABASE_URL
      : process.env.LOCAL_DATABASE_URL,
};

module.exports = dev;
