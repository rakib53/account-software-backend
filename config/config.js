require("dotenv").config();

const dev = {
  port: process.env.PORT || 5000,
  node_env: process.env.NODE_ENV,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  database_url:
    process.env.NODE_ENV === "production"
      ? process.env.REMOTE_DATABASE_URL
      : process.env.LOCAL_DATABASE_URL,
  remote_database_url: process.env.REMOTE_DATABASE_URL,
  local_databse_url: process.env.LOCAL_DATABASE_URL,
};

module.exports = dev;
